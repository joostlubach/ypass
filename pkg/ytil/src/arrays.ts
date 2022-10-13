import { isArray } from 'lodash'

export function arrayMove<T>(array: T[], predicate: (it: T) => boolean, toIndex: number) {
  const fromIndex = array.findIndex(predicate)
  if (fromIndex < 0) { return array }

  const item = array.splice(fromIndex, 1)[0]
  array.splice(toIndex > fromIndex ? toIndex - 1 : toIndex, 0, item)
}

export function splitArray<T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] {
  const matching: T[] = []
  const rest:     T[] = []

  for (const item of array) {
    if (predicate(item)) {
      matching.push(item)
    } else {
      rest.push(item)
    }
  }

  return [matching, rest]
}

export function sparse<T>(array: Array<T | false | null | 0 | undefined>): T[] {
  return array.filter(Boolean) as T[]
}

export function flatMap<T, U>(input: T[], fn: (value: T) => U | U[]): U[] {
  const result: U[] = []
  for (const value of input) {
    const out = fn(value)
    if (isArray(out)) {
      result.push(...out)
    } else {
      result.push(out)
    }
  }
  return result
}