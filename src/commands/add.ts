import { CliCommand } from '~/command'
import { CurrentSpriteDefinition } from '~/sprite'

export function addCommand() {
  const command = new CliCommand()

  command
    .name('add')
    .description('add SVGs')

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
    svg-sprite-select add country-flags/be
    svg-sprite-select add font-awesome/solid/acorn font-awesome/solid/acorn
    svg-sprite-select add font-awesome/{light,solid}/acorn
    svg-sprite-select add font-awesome/**/acorn
    svg-sprite-select add country-flags/*
    svg-sprite-select add font-awesome/solid/*
    svg-sprite-select add **
`)

  command
    .action((args: string[], { build }: { build: boolean }) => {
      const definition = new CurrentSpriteDefinition()

      const modified = definition.addSvgs(args)
      if (!modified)
        return

      definition.save()

      if (!build)
        return
      definition.build()
    })

  return command
}
