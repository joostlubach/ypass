from abc import ABC, abstractmethod
from typing import Iterable

from ypass.password import Password


class Formatter(ABC):

  def format_list(self, passwords: Iterable[Password]):
    return (self.format_single(it) for it in passwords)

  @abstractmethod
  def format_single(self, password: Password): ...