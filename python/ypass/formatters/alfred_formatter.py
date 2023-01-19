import json
from typing import Iterable, Iterator

from ypass.formatters.formatter import Formatter
from ypass.password import Password


class AlfredFormatter(Formatter):

  def format_list(self, passwords: Iterator[Password]):
    jsons = [self.to_json(password) for password in passwords]
    yield json.dumps(jsons)

  def format_single(self, password: Password):
    return json.dumps(self.to_json(password))

  def to_json(self, password: Password):
    return {
      'uid':          password.account,
      'type':         'password',
      'title':        password.account,
      'arg':          password.account,
      'autocomplete': password.account,
    }