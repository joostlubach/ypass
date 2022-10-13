import KeychainBackend from '../backends/keychain/KeychainBackend'

export default async function list(options: ListOptions) {
  const {
    format = 'plain',
    subtitle,
  } = options

  const backend   = new KeychainBackend()
  const locators = await backend.listPasswords()

  if (format === 'plain') {
    for (const locator of locators) {
      if (locator.type !== 'generic') { continue }
      process.stdout.write(`${locator.name}\n`)
    }
  } else {
    const items: any[] = []
    for (const locator of locators) {
      if (locator.type !== 'generic') { continue }
      items.push({
        uid:          locator.name,
        type:         'password',
        title:        locator.name,
        subtitle:     subtitle?.replace('{{name}}', locator.name),
        arg:          locator.name,
        autocomplete: locator.name,
      })
    }
    process.stdout.write(JSON.stringify({items}) + '\n')
  }
}

export interface ListOptions {
  format?:   'plain' | 'alfred'
  subtitle?: string
}