import sys
from abc import ABC
from enum import Enum
from typing import Iterable

from ..password import Password


class Formatter(ABC):

  class Mode(int, Enum):
    NAME_ONLY         = 1
    PASSWORD_ONLY     = 2
    NAME_AND_PASSWORD = 3

  def __init__(self, conf: dict):
    self.conf = conf
    self.mode = self.Mode.NAME_ONLY

  def print_list(self, passwords: Iterable[Password]):
    for line in self._format_list(passwords):
      sys.stdout.write(line + '\n')

  def print_single(self, password: Password):
    line = self._format_single(password)
    sys.stdout.write(line + '\n')

  def _format_list(self, passwords: Iterable[Password]):
    raise NotImplemented

  def _format_single(self, password: Password):
    raise NotImplemented

