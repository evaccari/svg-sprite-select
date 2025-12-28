import { CliCommand } from '~/command'
import { CurrentSpriteDefinition } from '~/sprite'

export function spriteCommand() {
  const command = new CliCommand()

  command
    .name('sprite')
    .description('set SVG sprite path')

  command
    .argument(
      '<path>',
      'SVG sprite path',
    )
    .option(
      '--build',
      'do not build',
    )

  command
    .addHelpText('after', `
Example call:
    - set value:        svg-sprite-select sprite ./font-awesome.svg
    - unset value:      svg-sprite-select sprite ""`)

  command
    .action((path: string, { build }: { build: boolean }) => {
      const definition = new CurrentSpriteDefinition()

      path !== '' ? definition.setSpritePath(path) : definition.unsetSpritePath()
      definition.save()

      if (!build)
        return
      definition.build()
    })

  return command
}
