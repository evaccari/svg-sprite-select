class SpriteError extends Error {
  public readonly context?: string

  public constructor(message: string, context?: string) {
    super(message)
    this.context = context

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SpriteError)
    }
  }
}

export {
  SpriteError,
}
