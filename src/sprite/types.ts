import type File from 'vinyl'
import type { SpriteSettingsProperties } from './constants'
import type { WindowsPath } from '~/typeguard/types'

interface SpriteDefinitionObject extends Record<string, unknown> {
  settings?: SpriteSettings
  svgs?: string[]
}

type SpriteSettings = {
  [key in typeof SpriteSettingsProperties[number]]?: WindowsPath;
}

type WorkerCompileCallback = (sprite: File, html?: File) => void

interface WorkerCompileResults {
  symbol: {
    example?: File
    sprite: File
  }
}

export type {
  SpriteDefinitionObject,
  SpriteSettings,
  WorkerCompileCallback,
  WorkerCompileResults,
}
