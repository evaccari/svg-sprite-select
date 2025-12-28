import { CliCommand } from '~/command'
import { CurrentSpriteDefinition } from '~/sprite'

export function useCommand() {
  const command = new CliCommand()

  command
    .name('use')
    .description('use another SVG sprite definition')

  command
    .argument(
      '<path>',
      'file location of the new SVG sprite definition',
    )

  command
    .addHelpText('after', `
Example call:
    svg-sprite-select use ./font-awesome.json`)

  command
    .action((path) => {
      CurrentSpriteDefinition.setCurrentDefinition(path)
      const definition = new CurrentSpriteDefinition()
      definition.about()
    })

  return command
}
