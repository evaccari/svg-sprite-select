import type { WindowsPath } from '~/typeguard/types'
import { SpriteError } from '~/misc/error'
import { readFile, removeFile, writeFile } from '~/misc/file'
import { checkFilePath } from '~/typeguard'
import { SpriteContexts, SpriteExtensions } from './constants'
import { SpriteDefinition } from './sprite-definition'

class CurrentSpriteDefinition extends SpriteDefinition {
  private static readonly CURRENT_DEFINITION_FILE_PATH = './.svg-sprite-select/current-sprite.txt'

  public constructor() {
    super(CurrentSpriteDefinition.getCurrentDefinition())
  }

  public static deleteCurrentDefinition(): void {
    removeFile(CurrentSpriteDefinition.CURRENT_DEFINITION_FILE_PATH)
  }

  public static getCurrentDefinition(): WindowsPath {
    try {
      const path = readFile(CurrentSpriteDefinition.CURRENT_DEFINITION_FILE_PATH).trim()
      checkFilePath(path, SpriteExtensions.JSON)
      return path
    }
    catch {
      throw new SpriteError('No current SVG sprite definition', SpriteContexts.DEFINITION)
    }
  }

  public static setCurrentDefinition(path: string): void {
    try {
      checkFilePath(path, SpriteExtensions.JSON)
    }
    catch (error: unknown) {
      if (!(error instanceof Error))
        throw error
      throw new SpriteError('Expected a JSON file path with an existing parent directory', SpriteContexts.DEFINITION)
    }

    writeFile(CurrentSpriteDefinition.CURRENT_DEFINITION_FILE_PATH, path, true)
  }
}

export {
  CurrentSpriteDefinition,
}
