import importlib
import json
from enum import Enum
from typing import Optional

import humps
from click import BadArgumentUsage

from ..formatters.formatter import Formatter


class Format(str, Enum):
  text   = 'text'
  alfred = 'alfred'
  table  = 'table'

  def get_formatter(self, conf_str: Optional[str]) -> Formatter:
    pkg_key  = f'{self.value}_formatter'
    type_key = humps.pascalize(pkg_key)

    try:
      conf = json.loads(conf_str or '{}')
    except (TypeError, json.JSONDecodeError):
      raise BadArgumentUsage(f"Invalid format configuration: `{conf_str}`")

    try:
      module = importlib.import_module(f'{__name__}.{pkg_key}')
      Formatter = getattr(module, type_key)
      return Formatter(conf)
    except (ModuleNotFoundError, KeyError):
      raise BadArgumentUsage(f"Unknown format: {self.value}")