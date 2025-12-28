import { Presets, SingleBar } from 'cli-progress'

class ProgressBar extends SingleBar {
  public constructor(format: string) {
    super({
      barCompleteChar: '\u2588',
      barGlue: '\u001B[33m',
      barIncompleteChar: '\u2591',
      barsize: 50,
      etaBuffer: 20,
      format,
      fps: 30,
      stopOnComplete: true,
    }, Presets.shades_classic)
  }

  public start(total: number): void {
    super.start(total, 0)
  }
}

export {
  ProgressBar,
}
