import { Backend, GenericPasswordLocator, Password, PasswordLocator } from '~/types'
import { exec } from '~/util'
import { InvalidLocatorError, LocatorNotFoundError, UnsupportedPlatformError } from './errors'
import { parseKeychainOutput } from './parsing'

export default class KeychainBackend implements Backend {

  constructor() {
    checkPlatform()
  }

  public async listPasswords(): Promise<PasswordLocator[]> {
    const {stdout} = await exec(SECURITY_PATH, ['dump-keychain'], {
      capture: ['stderr', 'stdout'],
      throws:  true,
    })

    const lines = (stdout ?? '').split('\n')
    const items = parseKeychainOutput(lines)

    const locators: PasswordLocator[] = []
    for (const item of items) {
      const {svce, acct} = item.attributes
      if (svce !== SERVICE) { continue }
      if (acct == null) { continue }

      locators.push({type: 'generic', name: acct})
    }

    return locators
  }

  public async getPassword(locator: PasswordLocator): Promise<Password | null> {
    if (locator.type !== 'generic') {
      throw new InvalidLocatorError()
    }

    const {stderr} = await exec(SECURITY_PATH, [
      'find-generic-password',
      '-s', SERVICE,
      '-a', locator.name,
      '-g',
    ], {
      capture: ['stderr'],
      throws:  false,
    })

    const lines = (stderr ?? '').split('\n')
    for (const line of lines) {
      const match = line.match(/^password:\s(.+)$/)
      if (match == null) { continue }

      const passwordRaw = match[1].trim()
      if (passwordRaw.length === 0) { continue }

      return {
        locators: [locator],
        password: JSON.parse(passwordRaw),
      }
    }


    return null
  }

  public async storePassword(password: Password): Promise<boolean> {
    const genericLocator = PasswordLocator.get<GenericPasswordLocator>(password, 'generic')
    if (genericLocator == null) {
      throw new LocatorNotFoundError()
    }

    const {exitCode} = await exec(SECURITY_PATH, [
      'add-generic-password',
      '-s', SERVICE,
      '-a', genericLocator.name,
      '-w', password.password,
      '-U',
    ], {
      throws: true,
    })

    return exitCode === 0
  }

  public async removePassword(locator: PasswordLocator): Promise<boolean> {
    if (locator.type !== 'generic') {
      throw new InvalidLocatorError()
    }

    const {exitCode} = await exec(SECURITY_PATH, [
      'delete-generic-password',
      '-s', SERVICE,
      '-a', locator.name,
    ], {
      throws: false,
    })

    return exitCode === 0
  }

}

function checkPlatform() {
  if (process.platform !== 'darwin') {
    throw new UnsupportedPlatformError()
  }
}

const SECURITY_PATH = '/usr/bin/security'
const SERVICE = 'ypass'