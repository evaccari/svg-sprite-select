import type { WindowsPath, WindowsPathEx } from './types'
import { existsSync } from 'node:fs'
import { SpriteError } from '~/misc/error'
import { testWriteFile } from '~/misc/file'

const checkArray: <T>(array: unknown, check: <T>(value: unknown) => asserts value is T) => asserts array is T[]
  = <T>(array: unknown, check: <T>(value: unknown) => asserts value is T): asserts array is T[] => {
    if (!Array.isArray(array) || array.length === 0)
      throw new SpriteError('Expected a non-empty string array')

    for (const value of array)
      check(value)
  }

const checkString: (value: unknown) => asserts value is string = (value: unknown): asserts value is string => {
  if (typeof value === 'string')
    return
  throw new SpriteError('Expected a string')
}

const checkFileExtension: (path: unknown, extension: string) => asserts path is string = (path: unknown, extension: string): asserts path is string => {
  checkString(path)
  if (path.endsWith(`.${extension}`))
    return
  throw new SpriteError('Incorrect file path extension')
}

const checkWindowsPathEx: (winPath: unknown) => asserts winPath is WindowsPath = (winPath: unknown): asserts winPath is WindowsPathEx => {
  checkString(winPath)
  if (existsSync(winPath))
    return
  throw new SpriteError('Expected an existing Windows path')
}

const checkWindowsPath: (winPath: unknown) => asserts winPath is WindowsPath = (winPath: unknown): asserts winPath is WindowsPath => {
  checkString(winPath)
  if (existsSync(winPath))
    return
  try {
    testWriteFile(winPath)
  }
  catch {
    throw new SpriteError('Expected a Windows path with an existing parent directory')
  }
}

const checkFilePath: (path: unknown, extension: string) => asserts path is WindowsPath = (path: unknown, extension: string): asserts path is WindowsPath => {
  checkFileExtension(path, extension)
  checkWindowsPath(path)
}

const checkFilePathEx: (path: unknown, extension: string) => asserts path is WindowsPathEx = (path: unknown, extension: string): asserts path is WindowsPathEx => {
  checkFileExtension(path, extension)
  checkWindowsPathEx(path)
}

const checkObject: (value: unknown) => asserts value is Record<string, unknown> = (value: unknown): asserts value is Record<string, unknown> => {
  if (value !== null && typeof value === 'object' && !Array.isArray(value))
    return
  throw new SpriteError('Expected an object')
}

const checkProperties: (value: unknown, validProps: readonly string[]) => asserts value is Record<string, unknown> = (value: unknown, validProps: readonly string[]): asserts value is Record<string, unknown> => {
  checkObject(value)
  const invalidPropPaths = Object.keys(value).reduce((paths: string[], prop) => {
    if (!validProps.includes(prop))
      paths.push(`${prop}`)
    return paths
  }, [])

  if (invalidPropPaths.length === 0)
    return
  throw new SpriteError('Unexpected property names')
}

export {
  checkArray,
  checkFilePath,
  checkFilePathEx,
  checkObject,
  checkProperties,
  checkString,
}
