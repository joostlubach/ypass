import { isArray } from 'lodash'

export abstract class MapBuilder {

  public static by<K, V>(values: V[], keyForValue: (value: V) => K): Map<K, V> {
    const result = new Map<K, V>()
    for (const value of values) {
      const key = keyForValue(value)
      result.set(key, value)
    }
    return result
  }

  public static groupBy<K, V>(values: V[], keyForValue: (value: V) => K | K[]): Map<K, V[]> {
    const result = new Map<K, V[]>()

    for (const value of values) {
      const key = keyForValue(value)
      const keys = isArray(key) ? key : [key]
      for (const key of keys) {
        let item = result.get(key)
        if (item == null) {
          result.set(key, item = [])
        }
        item.push(value)
      }
    }

    return result
  }

}