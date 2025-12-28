import { CliCommand } from '~/command'
import { CurrentSpriteDefinition } from '~/sprite'

export function rmCommand() {
  const command = new CliCommand()

  command
    .name('rm')
    .description('remove SVGs')

  command
    .argument(
      '<svgs...>',
      'list of svgs',
    )
    .option(
      '--build',
      'do not build',
    )

  command
    .addHelpText('after', `
Example call:
    svg-sprite-select rm country-flags/be
    svg-sprite-select rm font-awesome/solid/acorn font-awesome/solid/acorn
    svg-sprite-select rm font-awesome/{light,solid}/acorn
    svg-sprite-select rm font-awesome/**/acorn
    svg-sprite-select rm country-flags/*
    svg-sprite-select rm font-awesome/solid/*
    svg-sprite-select rm **
`)

  command
    .action((args: string[], { build }: { build: boolean }) => {
      const definition = new CurrentSpriteDefinition()

      const modified = definition.removeSvgs(args)
      if (!modified)
        return

      definition.save()

      if (!build)
        return
      definition.build()
    })

  return command
}
