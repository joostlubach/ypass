import importlib
import sys
from enum import Enum

import humps
from click import BadArgumentUsage

from ypass.formatters.formatter import Formatter


class Format(str, Enum):
  text = 'text'
  alfred = 'alfred'

  def get_formatter(self) -> Formatter:
    pkg_key  = f'{self.value}_formatter'
    type_key = humps.pascalize(pkg_key)
    try:
      module = importlib.import_module(f'{__name__}.{pkg_key}')
      Formatter = getattr(module, type_key)
      return Formatter()
    except (ModuleNotFoundError, KeyError):
      raise BadArgumentUsage(f"Unknown format: {self.value}")