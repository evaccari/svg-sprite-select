import { CliCommand } from '~/command'
import { CurrentSpriteDefinition } from '~/sprite'

export function clearCommand() {
  const command = new CliCommand()

  command
    .name('clear')
    .description('clear the current SVG sprite definition')

  command
    .action(() => {
      const definition = new CurrentSpriteDefinition()
      definition.clear()
      CurrentSpriteDefinition.deleteCurrentDefinition()
    })

  return command
}
