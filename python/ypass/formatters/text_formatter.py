import json
from typing import Iterable

from ..formatters.formatter import Formatter
from ..password import Password


class TextFormatter(Formatter):

  def _format_list(self, passwords: Iterable[Password]):
    return (self._format_single(password) for password in passwords)

  def _format_single(self, password: Password):
    if self.mode == Formatter.Mode.NAME_ONLY:
      return password.name
    elif self.mode == Formatter.Mode.PASSWORD_ONLY:
      return password.password
    else:
      return f'{password.name}\t{password.password}'