from sys import stdout
from typing import Optional

import typer

from ..args import FormatArgument
from ..backends import get_backend
from ..formatters import Format
from ..util import PasswordNotFound, PasswordQuery


def show(
  name:           str           = typer.Argument(..., help="The name of the password to show."),
  format:         Format        = FormatArgument,
  format_conf:    Optional[str] = typer.Option(None, help="A JSON object with additional configuration for the formatter."),
):
  """
  Shows the password with the given NAME.
  """

  query     = PasswordQuery(name = name)

  formatter = format.get_formatter(format_conf)

  try:
    password = get_backend().show(query)
    formatter.print_single(password)
  except PasswordNotFound:
    print(f"Password '{name}' not found.")
    raise typer.Exit(1)