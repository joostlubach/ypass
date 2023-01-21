import subprocess

from ...util import PasswordExists, PasswordNotFound, PasswordQuery
from .consts import SERVICE_NAME
from .password_reader import PasswordReader


class KeychainBackend:

  def list(self, query: PasswordQuery, include_passwords = False):
    cmd = ['/usr/bin/security', 'dump-keychain']
    
    process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if process.stdout is None: return []

    reader   = PasswordReader(process.stdout, process.stderr)
    filtered = (password for password in reader() if query.match(password))

    if include_passwords:
      return (
        self._retrieve(PasswordQuery(name = password.name))
        for password in filtered
      )
    else:
      return filtered


  def show(self, query: PasswordQuery):
    password = self._retrieve(query)
    if not password: raise PasswordNotFound
    return password

  def has(self, query: PasswordQuery):
    pass

  def add(self, name: str, password: str):
    exitcode = self._store(name, password, False)
    if exitcode == 45: raise PasswordExists

  def update(self, name: str, password: str):
    exitcode = self._store(name, password, True)
    print(exitcode)
    if exitcode == 44: raise PasswordNotFound

  def delete(self, name: str):
    cmd = [
      '/usr/bin/security', 'delete-generic-password',
      '-s', SERVICE_NAME,
      '-a', name,
    ]

    process = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    match process.returncode:
      case 44: raise PasswordNotFound
      
  def _retrieve(self, query: PasswordQuery):
    cmd = [
      '/usr/bin/security', 'find-generic-password',
      '-s', SERVICE_NAME,
    ]

    if query.name:
      cmd += ['-a', query.name]

    cmd += ['-g']

    process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if process.stdout is None: return []

    reader    = PasswordReader(process.stdout, process.stderr)
    generator = (password for password in reader())
    return next(generator, None)

  def _store(self, name: str, password: str, update: bool):
    cmd = [
      '/usr/bin/security', 'add-generic-password',
      '-s', SERVICE_NAME,
      '-a', name,
    ]

    if update:
      cmd += ['-U']

    cmd += ['-w', password]

    process = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    return process.returncode