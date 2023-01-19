import json
import re
import subprocess
from datetime import datetime
from enum import Enum
from typing import IO, Optional

from ..password import Password
from ..util.password_query import PasswordQuery


class KeychainBackend:

  def list(self, query: PasswordQuery):
    cmd = ['/usr/bin/security', 'dump-keychain']
    
    process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if process.stdout is None: return []

    reader = PasswordReader(process.stdout)
    return (password for password in reader() if query.match(password))

class PasswordReader:

  Mode = Enum('Mode', ['PREAMBLE', 'ATTRIBUTES'])

  def __init__(self, input: IO[bytes]):
    self.input = input

  def __call__(self):
    return self.filtered()

  def filtered(self):
    return (it for it in self.all() if self.include(it))

  def all(self):
    current = None
    mode    = PasswordReader.Mode.PREAMBLE

    def parse_preamble_line(line: str):
      nonlocal current, mode

      match = re.match(r'^(\w+)\s*:\s*(.*)$', line)
      if not match: return

      name, value = match.groups()
      if not current: current = Password('')

      if name == 'attributes':
        mode = PasswordReader.Mode.ATTRIBUTES
      else:
        current.setattr(name, value)

    def parse_attributes_line(line: str):
      nonlocal current, mode

      match = re.match(r'^\s*(.+?)<(.*?)>\s*=\s*(.*?)$', line)
      if not match:
        yield current
        current = None
        mode = PasswordReader.Mode.PREAMBLE
      else:
        name  = parse_attribute_name(match[1].strip())
        value = parse_attribute_value(match[2].strip(), match[3].strip())

        if name == 'acct':
          current.account = value
        else:
          current.setattr(name, value)

    def parse_attribute_name(name: str):
      if re.match('^".*"$', name):
        return name[1:-1]
      elif re.match(r'^0x\d+$', name):
        return int(name, 16)
      elif re.match(r'^0\d+$', name):
        return int(name, 16)
      elif re.match(r'^\d+$', name):
        return int(name, 10)
      else:
        return name

    def parse_attribute_value(type_hint: str, value: str):
      if value == '<NULL>':
        return None
      elif value.startswith('"'):
        return json.loads(value)
      elif value.startswith('0x'):
        if type_hint == 'blob':
          return read_bytes(value)
        else:
          return read_number(value)
      elif type == 'timedate':
        return read_date(value)
      else:
        return value

    def read_bytes(value: str) -> Optional[bytearray]:
      if value.startswith('"'):
        return json.loads(value)
      else:
        match = re.match(r'^0x([0-9a-f]+).*$', value, flags=re.IGNORECASE)
        return bytearray.fromhex(match[1]) if match else None

    def read_date(_: str) -> Optional[datetime]:
      return None

    def read_number(value: str) -> Optional[int]:
      if value.startswith('0x'):
        match = re.match(r'^0x([0-9a-f]+).*$', value, flags=re.IGNORECASE)
        return int(match[1], 16) if match else None
      else:
        return int(value, 10)

    for line in self.input:
      line = line.decode('utf-8')

      if mode == PasswordReader.Mode.PREAMBLE:
        parse_preamble_line(line)
      else:
        yield from parse_attributes_line(line)

    if current: yield current

  def include(self, password: Password):
    return password.getattr('svce') == 'ypass'