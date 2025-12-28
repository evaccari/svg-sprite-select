import process from 'node:process'
import { SpriteError } from '~/misc/error'
import * as log from '~/misc/logger'
import { CliCommand } from './command'
import {
  addCommand,
  buildCommand,
  clearCommand,
  currentCommand,
  htmlCommand,
  openCommand,
  rmCommand,
  spriteCommand,
  useCommand,
} from './commands'

const cli = new CliCommand()

cli
  .name('svg-sprite-select')
  .description('A CLI tool to manage one SVG sprite at a time using a definition saved to a JSON file')

cli
  .addCommand(addCommand())
  .addCommand(buildCommand())
  .addCommand(clearCommand())
  .addCommand(currentCommand())
  .addCommand(htmlCommand())
  .addCommand(openCommand())
  .addCommand(rmCommand())
  .addCommand(spriteCommand())
  .addCommand(useCommand())

if (process.argv.slice(2).length === 0) {
  cli.outputHelp()
  process.exit(0)
}

try {
  cli.parse()
}
catch (error: unknown) {
  if (!(error instanceof SpriteError))
    throw error
  log.error(error.message, error.context ?? 'ERROR')
}
