import type { Config, DefsAndSymbolSpecificModeConfig, SVGSpriter } from 'svg-sprite'
import type File from 'vinyl'
import type { WorkerCompileCallback, WorkerCompileResults } from './types'
import type { WindowsPath, WindowsPathEx } from '~/typeguard/types'
import { basename, resolve, sep } from 'node:path'
import SvgSprite from 'svg-sprite'
import { readFile } from '~/misc/file'
import { checkFilePath } from '~/typeguard'
import { SpriteBasePath, SpriteExtensions } from './constants'

class SvgSpriteWorker {
  private readonly svgSpriteInstance: SVGSpriter

  public constructor(sprite: WindowsPath, example?: WindowsPath) {
    const config = SvgSpriteWorker.getConfiguration(sprite, example)
    this.svgSpriteInstance = new SvgSprite(config)
  }

  private static getConfiguration(sprite: WindowsPath, example?: WindowsPath): Config {
    checkFilePath(sprite, SpriteExtensions.SVG)

    const symbol: DefsAndSymbolSpecificModeConfig = {
      dest: '.',
      inline: false,
      sprite,
    }

    if (example)
      symbol.example = { dest: example }

    const basePath = SpriteBasePath + sep
    const regex = /[^/\\]+[/\\]([^.]+)\..+/
    const sepRegex = /[/\\]/g

    return {
      mode: {
        symbol,
      },
      shape: {
        dimension: {
          maxHeight: 48,
          maxWidth: 48,
        },
        id: {
          generator: (_: string, file: File) =>
            file.path
              .replace(basePath, '')
              .replace(regex, '$1')
              .replace(sepRegex, '--'),
        },
      },
    }
  }

  public add(path: WindowsPathEx): void {
    const content = readFile(path)
    this.svgSpriteInstance.add(resolve(path), basename(path), content)
  }

  public compile(callback: WorkerCompileCallback): void {
    return this.svgSpriteInstance.compile((error: Error, result: WorkerCompileResults) => {
      if (error)
        throw error
      const { symbol } = result
      return callback(symbol.sprite, symbol.example)
    })
  }
}

export {
  SvgSpriteWorker,
}
