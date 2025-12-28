import type { SpriteDefinitionObject, SpriteSettings } from './types'
import type { WindowsPath, WindowsPathEx } from '~/typeguard/types'
import { Buffer } from 'node:buffer'
import { format, parse, resolve } from 'node:path'
import FastGlob from 'fast-glob'
import { green, red } from 'yoctocolors'
import { SpriteError } from '~/misc/error'
import { openFile, removeFile, writeFile } from '~/misc/file'
import { readJson, writeJson } from '~/misc/json'
import * as log from '~/misc/logger'
import { ProgressBar } from '~/misc/progress-bar'
import { checkArray, checkFilePath, checkFilePathEx, checkProperties, checkString } from '~/typeguard'
import {
  SpriteBasePath,
  SpriteContexts,
  SpriteExtensions,
  SpriteHtmlProperty,
  SpritePathProperty,
  SpriteProgressFormat,
  SpriteProperties,
  SpriteSettingsProperties,
} from './constants'
import { SvgSpriteWorker } from './svg-sprite-worker'

class SpriteDefinition {
  private readonly path: WindowsPath
  private readonly settings: SpriteSettings = {}
  private readonly svgArgs = new Set<string>()

  public constructor(path: WindowsPath) {
    this.path = path

    const file = readJson(this.path)
    checkProperties(file, SpriteProperties)

    if ('settings' in file) {
      this.checkSettings(file.settings)
      this.settings = file.settings
    }

    if ('svgs' in file) {
      this.svgArgs = this.parseSvgArgs(file.svgs)
    }

    if (Object.keys(file).length === 0) {
      const { dir, name } = parse(path)
      this.setHtmlPath(format({ dir, ext: SpriteExtensions.HTML, name }))
      this.setSpritePath(format({ dir, ext: SpriteExtensions.SVG, name }))
    }
  }

  public about(): void {
    log.info(`"${resolve(this.path)}"`, SpriteContexts.DEFINITION)

    if (this.settings.html)
      log.info(`"${resolve(this.settings.html)}"`, SpriteContexts.HTML)

    if (this.settings.sprite)
      log.info(`"${resolve(this.settings.sprite)}"`, SpriteContexts.SPRITE)

    log.info(`Number of SVGs selected: ${this.svgArgs.size}`, SpriteContexts.SVG)
  }

  public addSvgs(args: string[]): boolean {
    const { size } = this.svgArgs

    const argsSet = this.parseArgs(args)
    for (const arg of argsSet) {
      const svgArgs = this.convertArgToSvgArgs(arg)
      for (const svgArg of svgArgs) {
        if (this.svgArgs.has(svgArg))
          continue
        this.svgArgs.add(svgArg)
        this.notifyAddedSvgArg(svgArg)
      }
    }

    return size !== this.svgArgs.size
  }

  public build(): void {
    if (this.svgArgs.size === 0) {
      log.warn('No SVGs selected', SpriteContexts.SVG)
      this.removeHtmlFile()
      this.removeSpriteFile()
      return
    }

    const paths = this.getSvgPaths()

    this.checkSpritePath(this.settings.sprite)
    const svgSpriteWorker = new SvgSpriteWorker(this.settings.sprite, this.settings.html)

    const progressBar = new ProgressBar(SpriteProgressFormat)
    progressBar.start(paths.size)

    for (const path of paths) {
      svgSpriteWorker.add(path)
      progressBar.increment()
    }

    svgSpriteWorker.compile((sprite, html) => {
      if (sprite.contents instanceof Buffer) {
        writeFile(sprite.path, sprite.contents)
        this.notifySavedFile(sprite.path, SpriteContexts.SPRITE)
      }

      if (!!html && html.contents instanceof Buffer) {
        writeFile(html.path, html.contents)
        this.notifySavedFile(html.path, SpriteContexts.HTML)
      }
    })
  }

  public clear(): void {
    this.svgArgs.clear()
    this.unsetHtmlPath()
    this.unsetSpritePath()
    this.save()
  }

  public open(): void {
    if (this.settings.html && openFile(this.settings.html))
      return
    throw new SpriteError('No HTML example document to open', SpriteContexts.HTML)
  }

  public removeSvgs(args: string[]): boolean {
    const { size } = this.svgArgs

    const argsSet = this.parseArgs(args)
    for (const arg of argsSet) {
      // to delete record that are present in JSON but no longer available in the list of available SVGs
      if (this.svgArgs.has(arg)) {
        this.svgArgs.delete(arg)
        this.notifyRemovedSvgArg(arg)
      }

      try {
        const svgArgs = this.convertArgToSvgArgs(arg)
        for (const svgArg of svgArgs) {
          if (!this.svgArgs.has(svgArg))
            continue
          this.svgArgs.delete(svgArg)
          this.notifyRemovedSvgArg(svgArg)
        }
      }
      catch {
        // make sense for records that are present in JSON but no longer available in the list of available SVGs
      }
    }

    return size !== this.svgArgs.size
  }

  public save(): void {
    const definition: SpriteDefinitionObject = {}

    if (Object.keys(this.settings).length > 0)
      definition.settings = this.settings

    if (this.svgArgs.size > 0)
      definition.svgs = Array.from(this.svgArgs).sort()

    if (Object.keys(definition).length > 0) {
      writeJson(this.path, definition)
      this.notifySavedFile(this.path, SpriteContexts.DEFINITION)
      return
    }

    removeFile(this.path)
    this.notifyRemovedFile(this.path, SpriteContexts.DEFINITION)
  }

  public setHtmlPath(path: string): void {
    this.checkHtmlPath(path)
    this.removeHtmlFile()
    this.settings.html = path
  }

  public setSpritePath(path: string): void {
    this.checkSpritePath(path)
    this.removeSpriteFile()
    this.settings.sprite = path
  }

  public unsetHtmlPath(): void {
    this.removeHtmlFile()
    delete this.settings.html
  }

  public unsetSpritePath(): void {
    this.removeSpriteFile()
    delete this.settings.sprite
  }

  private checkHtmlPath(path: unknown): asserts path is WindowsPath {
    try {
      checkFilePath(path, SpriteExtensions.HTML)
    }
    catch (error: unknown) {
      if (!(error instanceof SpriteError))
        throw error
      throw new SpriteError('Expected a HTML file path with an existing parent directory', SpriteContexts.HTML)
    }
  }

  private checkSettings(settings: unknown): asserts settings is SpriteSettings {
    checkProperties(settings, SpriteSettingsProperties)
    const { html, sprite } = settings

    if (SpriteHtmlProperty in settings)
      this.checkHtmlPath(html)

    if (SpritePathProperty in settings)
      this.checkSpritePath(sprite)
  }

  private checkSpritePath(path: unknown): asserts path is WindowsPath {
    try {
      checkFilePath(path, SpriteExtensions.SVG)
    }
    catch (error: unknown) {
      if (!(error instanceof SpriteError))
        throw error
      throw new SpriteError('Expected a SVG file path with an existing parent directory', SpriteContexts.SPRITE)
    }
  }

  private convertArgToSvgArgs(arg: string): string[] {
    const array = FastGlob.globSync(`${arg}.${SpriteExtensions.SVG}`, { cwd: SpriteBasePath, extglob: false })
    const regex = new RegExp(`.${SpriteExtensions.SVG}$`)
    return array.map(path => path.replace(regex, ''))
  }

  private getSvgPath(svgArg: string): string {
    try {
      const path = format({ dir: SpriteBasePath, ext: SpriteExtensions.SVG, name: svgArg })
      checkFilePathEx(path, SpriteExtensions.SVG)
      return path
    }
    catch {
      throw new SpriteError(`No SVG file found for: ${svgArg}`, SpriteContexts.SVG)
    }
  }

  private getSvgPaths(): Set<WindowsPathEx> {
    const paths = Array.from(this.svgArgs).map(svgArg => this.getSvgPath(svgArg))
    return new Set(paths)
  }

  private notifyAddedSvgArg(svgArg: string): void {
    const message = `${svgArg} ${green('added')}`
    log.info(message, SpriteContexts.SVG)
  }

  private notifyRemovedSvgArg(svgArg: string): void {
    const message = `${svgArg} ${red('removed')}`
    log.info(message, SpriteContexts.SVG)
  }

  private notifyRemovedFile(path: WindowsPath, context: SpriteContexts): void {
    const message = `"${resolve(path)}" ${red('deleted')}`
    log.info(message, context)
  }

  private notifySavedFile(path: WindowsPath, context: SpriteContexts): void {
    const message = `"${resolve(path)}" ${green('saved')}`
    log.info(message, context)
  }

  // same code than parseSvgArgs but the notion is different, and lets us apply different behaviors
  private parseArgs(args: unknown): Set<string> {
    checkArray<string>(args, checkString)
    return new Set(args)
  }

  // same code than parseArgs but the notion is different, and lets us apply different behaviors
  private parseSvgArgs(svgArgs: unknown): Set<string> {
    checkArray<string>(svgArgs, checkString)
    return new Set(svgArgs)
  }

  private removeHtmlFile(): void {
    const { html } = this.settings
    if (!html || !removeFile(html))
      return
    this.notifyRemovedFile(html, SpriteContexts.HTML)
  }

  private removeSpriteFile(): void {
    const { sprite } = this.settings
    if (!sprite || !removeFile(sprite))
      return
    this.notifyRemovedFile(sprite, SpriteContexts.SPRITE)
  }
}

export {
  SpriteDefinition,
}
