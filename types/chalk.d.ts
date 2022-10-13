import * as _ from 'chalk'

declare module 'chalk' {

  export interface Chalk {
    (text: TemplateStringsArray, ...placeholders: any[]): string
  }
  
}