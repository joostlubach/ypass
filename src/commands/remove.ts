import KeychainBackend from '../backends/keychain/KeychainBackend'

export default async function _delete(name: string) {
  const backend = new KeychainBackend()
  await backend.removePassword({type: 'generic', name})
}