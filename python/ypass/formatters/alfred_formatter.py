import json
from typing import Iterable

from ..formatters.formatter import Formatter
from ..password import Password


class AlfredFormatter(Formatter):

  def _format_list(self, passwords: Iterable[Password]):
    # As JSON is not a stream format, we need to buffer the entire output.
    items = [self.to_json(password) for password in passwords]
    yield json.dumps({'items': items})

  def _format_single(self, password: Password):
    return json.dumps(self.to_json(password))

  def to_json(self, password: Password):
    subtitle = self.conf.get('subtitle', "Copy password '{}' to clipboard")

    return {
      'uid':          password.name,
      'type':         'password',
      'title':        password.name,
      'subtitle':     str.format(subtitle, password.name),
      'arg':          password.name,
      'autocomplete': password.name,
    }