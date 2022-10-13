import 'lodash'

declare module 'lodash' {
  interface LoDashStatic {
    isPlainObject<T = any>(arg: any): arg is Dictionary<T>
    isArray<T = any>(arg: any): arg is T[]
  }
}