import { CliCommand } from '~/command'
import { CurrentSpriteDefinition } from '~/sprite'

export function currentCommand() {
  const command = new CliCommand()

  command
    .name('current')
    .description('print the current SVG sprite definition')

  command
    .action(() => {
      const definition = new CurrentSpriteDefinition()
      definition.about()
    })

  return command
}
