import { CliCommand } from '~/command'
import { CurrentSpriteDefinition } from '~/sprite'

export function buildCommand() {
  const command = new CliCommand()

  command
    .name('build')
    .description('build the SVG sprite')

  command
    .action(() => {
      const spriteDefinition = new CurrentSpriteDefinition()
      spriteDefinition.build()
    })

  return command
}
