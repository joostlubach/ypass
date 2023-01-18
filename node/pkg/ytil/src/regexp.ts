import { escapeRegExp } from 'lodash'

export interface PatternToRegExpOptions {
  anchor?:    boolean | 'start' | 'end'
  wildcards?: boolean
  modifiers?: string
}

export function patternToRegExp(pattern: string, options: PatternToRegExpOptions = {}) {
  let regExpPattern = escapeRegExp(pattern)
  if (options.wildcards) {
    regExpPattern = regExpPattern.replace(/\\\*/g, '(.*?)')
  }
  if (options.anchor !== false) {
    regExpPattern = `^${regExpPattern}$`
  }

  return new RegExp(regExpPattern, options.modifiers)
}

export function parseRegExp(pattern: string) {
  if (/^\/(.*)\/([img]+)?$/.test(pattern)) {
    return new RegExp(RegExp.$1, RegExp.$2)
  } else {
    return new RegExp(pattern)
  }
}