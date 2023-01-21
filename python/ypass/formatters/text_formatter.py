import json
from typing import Iterable

from ..formatters.formatter import Formatter
from ..password import Password


class TextFormatter(Formatter):

  def _format_list(self, passwords: Iterable[Password]):
    return (self._format_single(password) for password in passwords)

  def _format_single(self, password: Password):
    if self.show_passwords:
      return f'{password.name}\t{password.password}'
    else:
      return password.name