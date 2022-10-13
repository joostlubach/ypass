import { KeychainItem } from './types'

export function parseKeychainOutput(lines: string[]) {
  const items: KeychainItem[] = []

  let currentItem: KeychainItem | null = null
  let attributes: boolean = false

  const parsePreambleLine = (line: string) => {
    const match = line.match(/^(\w+?):\s*(.*)$/)
    if (match == null) { return true }

    const [, key, value] = match
    if (currentItem == null || key === 'keychain') {
      currentItem = {attributes: {}} as KeychainItem
      items.push(currentItem)
    }

    if (key === 'attributes') {
      attributes = true
    } else {
      Object.assign(currentItem, {[key]: coerceValue(value)})
    }

    return true
  }

  const parseAttributeLine = (line: string) => {
    const match = line.match(/^\s+(.+?)<(.*?)>=(.*?)$/)
    if (currentItem == null) {
      return true
    }
    if (match == null) {
      attributes = false
      return false
    }

    const [, key, type, value] = match
    Object.assign(currentItem.attributes, {
      [coerceValue(key)]: coerceValue(value, type),
    })

    return true
  }

  for (let i = 0; i < lines.length; i++) {
    if (attributes) {
      if (!parseAttributeLine(lines[i])) { i-- }
    } else {
      if (!parsePreambleLine(lines[i])) { i-- }
    }
  }

  return items
}

function coerceValue(value: string, type?: string) {
  if (value === '<NULL>') { return null }

  switch (type) {
    case 'string':
      return JSON.parse(value)
    case 'blob':
      if (value.charAt(0) === '"') {
        return JSON.parse(value)
      } else {
        return readBlob(value)
      }
    case 'timedate':
      return readDate(value)
    case 'uint32': case 'sint32':
      return readNumber(value)
    default:
      if (value.match(/^0x/)) {
        return readNumber(value)
      } else if (value.match(/^"/)) {
        return JSON.parse(value)
      } else {
        return value
      }
  }
}

function readBlob(value: string) {
  if (!value.startsWith('0x')) { return null }

  const size  = (value.length - 2) / 2
  const bytes = new Uint8Array(size)

  for (let pos = 2; pos < value.length; pos += 2) {
    bytes[(pos - 2) / 2] = parseInt(value.slice(pos, 2), 16)
  }

  return new Blob([bytes])
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function readDate(_: string) {
  return null
}

function readNumber(value: string) {
  if (value.startsWith('0x')) {
    return parseInt(value.slice(2), 16)
  } else {
    return parseInt(value, 10)
  }
}