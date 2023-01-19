from typing import Iterable

from ypass.formatters.formatter import Formatter
from ypass.password import Password


class TextFormatter(Formatter):

  def format_single(self, password: Password):
    return password.password if password.password else password.account