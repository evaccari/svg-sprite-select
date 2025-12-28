import { CliCommand } from '~/command'
import { CurrentSpriteDefinition } from '~/sprite'

export function openCommand() {
  const command = new CliCommand()

  command
    .name('open')
    .description('open the SVG sprite')

  command
    .action(() => {
      const definition = new CurrentSpriteDefinition()
      definition.open()
    })

  return command
}
