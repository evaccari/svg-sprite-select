import type { WindowsPath } from '~/typeguard/types'
import { existsSync } from 'node:fs'
import { checkObject } from '~/typeguard'
import { readFile, writeFile } from './file'

function readJson(path: WindowsPath): Record<string, unknown> {
  if (!existsSync(path))
    return {}
  const fileContent = readFile(path)
  const content = JSON.parse(fileContent.toString())
  checkObject(content)
  return content
}

function jsonToString(json: Record<string, unknown>) {
  return JSON.stringify(json, null, 2)
}

function writeJson(path: WindowsPath, json: Record<string, unknown>) {
  const content = jsonToString(json)
  writeFile(path, content)
}

export {
  readJson,
  writeJson,
}
