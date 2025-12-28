import { Command } from 'commander'

export class CliCommand extends Command {
  public constructor() {
    super()

    this.configureHelp({
      sortSubcommands: true,
      sortOptions: true,
    })

    this.showHelpAfterError('(add --help for additional information)')
    this.showSuggestionAfterError()
  }
}
