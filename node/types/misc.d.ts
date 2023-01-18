declare type Primitive = number | string | boolean | null

declare type AnyFunction = (...args: any[]) => any
declare type AnyObject = Record<string, any>
declare type EmptyObject = Record<string, never>
declare type Serialized = AnyObject

declare type Constructor<T> = new (...args: any[]) => T
declare type AnyConstructor = Constructor<any>

declare type Mixin<I, S> = S & {prototype: I}
declare type AnyMixin = Mixin<any, any>

declare type InstanceOf<T extends AnyMixin | AnyConstructor> =
  T extends {prototype: infer I} ? I :
  T extends Constructor<I> ? I :
  never

declare type StaticsOf<T extends AnyMixin | AnyConstructor> =
  Omit<T, 'new' | 'constructor'>

declare type SomePartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

declare interface Subscription {
  remove: () => any
}