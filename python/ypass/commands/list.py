from typing import Optional

from typer import Context

from ypass.formatters.formatter import Formatter

from ..backends import get_backend
from ..util import PasswordQuery


def list(ctx: Context, filter: Optional[str] = None):
  """
  List all passwords matching the given FILTER.
  """

  query     = PasswordQuery(filter)
  passwords = get_backend().list(query)
  
  formatter: Formatter = ctx.obj.formatter
  formatted = formatter.format_list(passwords)

  for password in formatted:
    print('->', password)