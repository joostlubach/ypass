from .keychain_backend import KeychainBackend

__backend = KeychainBackend()
def get_backend(): return __backend