import KeychainBackend from '../backends/keychain/KeychainBackend'

export default async function list() {
  const backend   = new KeychainBackend()
  const locators = await backend.listPasswords()

  for (const locator of locators) {
    if (locator.type !== 'generic') { continue }
    process.stdout.write(`${locator.name}\n`)
  }
}