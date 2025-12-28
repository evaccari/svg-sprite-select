import { CliCommand } from '~/command'
import { CurrentSpriteDefinition } from '~/sprite'

export function htmlCommand() {
  const command = new CliCommand()

  command
    .name('html')
    .description('set HTML example page path')

  command
    .argument(
      '<path>',
      'HTML page path',
    )
    .option(
      '--build',
      'do not build',
    )

  command
    .addHelpText('after', `
Example call:
    - set value:        svg-sprite-select html ./font-awesome.html
    - unset value:      svg-sprite-select html ""`)

  command
    .action((path: string, { build }: { build: boolean }) => {
      const definition = new CurrentSpriteDefinition()

      path !== '' ? definition.setHtmlPath(path) : definition.unsetHtmlPath()
      definition.save()

      if (!build)
        return
      definition.build()
    })

  return command
}
