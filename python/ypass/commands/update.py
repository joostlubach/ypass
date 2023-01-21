from sys import stdout

import typer

from ..backends import get_backend
from ..util import PasswordNotFound


def update(
  name:     str = typer.Argument(..., help="The name of the password to update."),
  password: str = typer.Argument(..., help="The new password."),
):
  """
  Updates the password with the given NAME.
  """

  try:
    get_backend().update(name, password)
  except PasswordNotFound:
    print(f"Password '{name}' not found.")
    raise typer.Exit(2)