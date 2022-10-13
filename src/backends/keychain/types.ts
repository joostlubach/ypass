export interface KeychainItem {
  keychain:   string
  version:    number
  class:      number
  attributes: KeychainAttributes
  password?:  string
}

export type KeychainAttributes = WellKnownKeychainAttributes & {
  [key: number]: any
}

export interface WellKnownKeychainAttributes {
  alis?: string | null
  acct?: string | null
  cdat?: Date | null
  crtr?: number | null
  cusi?: number | null
  desc?: Blob | null
  gena?: Blob | null
  icmt?: Blob | null
  invi?: number | null
  mdat?: Date | null
  nega?: number | null
  prot?: Blob | null
  scrp?: number | null
  svce?: string | null
  type?: number | null
}