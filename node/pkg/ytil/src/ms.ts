import msOrig from 'ms'

export function ms(input: string | number) {
  if (typeof input === 'string') {
    return msOrig(input)
  } else {
    return input
  }
}