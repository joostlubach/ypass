import { isArray, isObject, isPlainObject } from 'lodash'

export async function modifyInObject<T extends AnyObject>(root: T, path: string, modify: ModifyInObjectCallback) {
  const segments = path.split('.')
  const leaf     = segments.pop()!

  let current: any = root
  while (current != null && segments.length > 0) {
    const segment = segments.shift()!
    if (isArray(current)) {
      current = current[keyToIndex(segment)]
    } else if (isObject(current)) {
      current = (current as any)[segment]
    } else {
      current = null
    }
  }
  if (current == null) { return false }

  const retval = await modify(root, current, leaf)
  return retval === false ? false : true
}

function keyToIndex(key: string) {
  const index = parseInt(key, 10)
  if (isNaN(index)) {
    throw new Error("Cannot descend into array with a string key")
  }
  return index
}

export type ModifyInObjectCallback = <T extends AnyObject>(
  root:   T,
  parent: any,
  key:    string | number
) => void | boolean | Promise<void | boolean>

export function deepMapKeys(arg: any, fn: (key: string | symbol) => any): any {
  if (isPlainObject(arg)) {
    const result: Record<string, any> = {}
    for (const [attribute, value] of Object.entries(arg)) {
      result[fn(attribute)] = deepMapKeys(value, fn)
    }
    return result
  } else if (isArray(arg)) {
    return arg.map(it => deepMapKeys(it, fn))
  } else {
    return arg
  }
}

export function deepMapValues(arg: any, fn: (value: any) => any): any {
  if (isPlainObject(arg)) {
    const result: Record<string, any> = {}
    for (const [attribute, value] of Object.entries(arg)) {
      result[attribute] = deepMapValues(value, fn)
    }
    return result
  } else if (isArray(arg)) {
    return arg.map(it => deepMapValues(it, fn))
  } else {
    return fn(arg)
  }
}