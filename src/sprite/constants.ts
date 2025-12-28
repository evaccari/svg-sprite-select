import { resolve } from 'node:path'

const SpriteBasePath = resolve(import.meta.dirname, '../svgs')

enum SpriteContexts {
  DEFINITION = 'DEFINITION',
  HTML = 'HTML',
  SPRITE = 'SPRITE',
  SVG = 'SVG',
}

enum SpriteExtensions {
  HTML = 'html',
  JSON = 'json',
  SVG = 'svg',
}

const SpriteProgressFormat = 'Sprite building progress |\u001B[32m{bar}\u001B[0m]| {percentage}% || Elapsed time: {duration_formatted} || ETA: {eta_formatted} || {value}/{total} SVGs'

const SpriteProperties = ['settings', 'svgs'] as const

const SpriteSettingsProperties = ['html', 'sprite'] as const

const SpriteHtmlProperty = 'html'

const SpritePathProperty = 'sprite'

export {
  SpriteBasePath,
  SpriteContexts,
  SpriteExtensions,
  SpriteHtmlProperty,
  SpritePathProperty,
  SpriteProgressFormat,
  SpriteProperties,
  SpriteSettingsProperties,
}
