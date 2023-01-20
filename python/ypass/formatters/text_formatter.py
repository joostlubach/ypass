from typing import Iterable

from ..formatters.formatter import Formatter
from ..password import Password


class TextFormatter(Formatter):

  def format_single(self, password: Password):
    return password.password if password.password else password.account