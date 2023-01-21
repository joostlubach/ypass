from sys import stdout
from typing import Optional

import typer

from ..args import FormatArgument
from ..backends import get_backend
from ..formatters import Format
from ..formatters.formatter import Formatter
from ..util import PasswordQuery


def list(
  format:         Format        = FormatArgument,
  format_conf:    Optional[str] = typer.Option(None, help="A JSON object with additional configuration for the formatter."),
  show_passwords: bool          = typer.Option(False, '-P', '--show-passwords', help="Set to true to show the passwords.")
):
  """
  List all passwords matching the given FILTER.
  """

  query     = PasswordQuery()
  passwords = get_backend().list(query, include_passwords = show_passwords)

  formatter = format.get_formatter(format_conf)
  formatter.show_passwords = show_passwords

  formatter.print_list(passwords)