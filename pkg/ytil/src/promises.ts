import { isFunction } from 'lodash'

export interface PromiseLike<R> {
  then: Promise<R>['then']
}

export function isPromise<R>(arg: any, strict: false): arg is PromiseLike<R>
export function isPromise<R>(arg: any, strict?: true): arg is Promise<R>
export function isPromise(arg: any, strict = true) {
  if (arg == null) { return false }
  if (!isFunction(arg.then)) { return false }

  if (strict && !isFunction(arg.catch)) { return false }
  if (strict && !isFunction(arg.finally)) { return false }

  return true
}

export function wrapInPromise<T>(arg: T | Promise<T>): Promise<T> {
  if (isPromise(arg)) {
    return arg
  } else {
    return Promise.resolve(arg)
  }
}