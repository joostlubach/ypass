from abc import ABC, abstractmethod
from typing import Iterable

from ..password import Password


class Formatter(ABC):

  def __init__(self, conf: dict):
    self.conf = conf

  def format_list(self, passwords: Iterable[Password]):
    return (self.format_single(it) for it in passwords)

  @abstractmethod
  def format_single(self, password: Password): ...