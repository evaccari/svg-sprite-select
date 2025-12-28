import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

function openFile(path: string): boolean {
  if (!existsSync(path))
    return false
  execSync(`start ${path}`)
  return true
}

const readFile = (path: string): string => readFileSync(path, 'utf-8')

function removeFile(path: string): boolean {
  if (!existsSync(path))
    return false
  unlinkSync(path)
  return true
}

function testWriteFile(path: string): boolean {
  if (existsSync(path))
    return true
  writeFile(path, '')
  return removeFile(path)
}

function writeFile(path: string, data: string | NodeJS.ArrayBufferView, force = false): void {
  if (force) {
    mkdirSync(dirname(path), { recursive: true })
  }

  writeFileSync(path, data, 'utf-8')
}

export {
  openFile,
  readFile,
  removeFile,
  testWriteFile,
  writeFile,
}
