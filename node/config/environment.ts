import Dotenv from 'dotenv'
import paths from './paths'

export type NodeEnvironment =
  | 'development'
  | 'task'
  | 'test'
  | 'production'

export type DataEnvironment =
  | 'local'
  | 'test'
  | 'integration'
  | 'acceptance'
  | 'live'

export type Module =
  // @index[../src/modules]: | ${variable:quoted}
  | 'api'
  // /index

Dotenv.config({path: paths.dotenv})

const environment = {
  node:   query<NodeEnvironment>(process.env.NODE_ENV ?? 'development'),
  data:   query<DataEnvironment>(process.env.DATA_ENV ?? 'local'),
  stack:  query<string>(process.env.APP_STACK ?? 'groundcontrol'),
  module: process.env.MODULE as Module,
}

export type Environment = typeof environment
export default environment

type EnvironmentQuery<E extends string> = {
  string: string
  toString(): string
  [Symbol.toPrimitive](): string

  switch: <T>(map: Partial<Record<E, T>> & {default: T}) => T
} & {
  [key in E]: boolean
}

function query<E extends string>(current: string) {
  const switchFn = <T>(map: Partial<Record<E, T>> & {default: T}) => {
    for (const [key, value] of Object.entries(map)) {
      if (key === current) { return value }
    }
    return map.default
  }

  return new Proxy({}, {
    get(target, key) {
      if (key === 'string') {
        return current
      } else if (key === 'toString' || key === Symbol.toPrimitive) {
        return () => current
      } else if (key === 'switch') {
        return switchFn
      } else {
        return key === current
      }
    },
  }) as EnvironmentQuery<E>
}