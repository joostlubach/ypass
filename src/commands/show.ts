import KeychainBackend from '../backends/keychain/KeychainBackend'

export default async function show(name: string) {
  const backend  = new KeychainBackend()
  const password = await backend.getPassword({type: 'generic', name})

  if (password != null) {
    process.stdout.write(password.password + '\n')
  }
}