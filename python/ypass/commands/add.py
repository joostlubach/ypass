from sys import stdout
from typing import Optional

import typer

from ..args import StdInArgument
from ..backends import get_backend
from ..util import PasswordExists, stdin_or_value


def add(
  name:     str           = typer.Argument(..., help="The name of the password to add."),
  password: Optional[str] = typer.Argument(None, help="The password to add [optional if --stdin is used]."),
  stdin:    bool          = StdInArgument
):
  """
  Adds the password with the given NAME.
  """

  password = stdin_or_value(stdin, password, "PASSWORD must be specified unless --stdin is used")

  try:
    get_backend().add(name, password)
  except PasswordExists:
    print(f"Password '{name}' already exists.")
    raise typer.Exit(2)