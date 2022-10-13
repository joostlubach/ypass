export interface Password {
  locators: PasswordLocator[]
  password: string
}

export type PasswordLocator =
  | GenericPasswordLocator
  | InternetPasswordLocator

export interface GenericPasswordLocator {
  type: 'generic'
  name: string
}

export interface InternetPasswordLocator {
  type:     'internet'
  url:      string
  username: string | null
}

export const PasswordLocator: {
  get: <PL extends PasswordLocator>(password: Password, type: PL['type']) => PL | null
} = {
  get: <PL extends PasswordLocator>(password: Password, type: PL['type']): PL | null => (
    password.locators.find(it => it.type === type) as PL ?? null
  ),
}

export interface Backend {

  listPasswords(): Promise<PasswordLocator[]>
  getPassword(locator: PasswordLocator): Promise<Password | null>
  storePassword(password: Password): Promise<boolean>
  removePassword(locator: PasswordLocator): Promise<boolean>

}