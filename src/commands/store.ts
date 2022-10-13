import KeychainBackend from '../backends/keychain/KeychainBackend'

export default async function store(name: string, password: string) {
  const backend = new KeychainBackend()
  await backend.storePassword({
    locators: [{type: 'generic', name}],
    password: password,
  })
}