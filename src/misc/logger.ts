import type { Format } from 'yoctocolors'
import { cyan, red, yellow } from 'yoctocolors'

function error(message: string, context: string) {
  return log(message, 'ERROR', context)
}

function info(message: string, context: string) {
  return log(message, 'INFO', context)
}

function log(message: string, level: string, context: string) {
  const colors: Record<string, Format> = {
    ERROR: red,
    INFO: cyan,
    WARN: yellow,
  }

  const coloredContext = level in colors ? colors[level](context.toUpperCase()) : context.toUpperCase()
  // eslint-disable-next-line no-console
  console.log(`${coloredContext} ${message}`)
}

function warn(message: string, context: string) {
  return log(message, 'WARN', context)
}

export {
  error,
  info,
  warn,
}
