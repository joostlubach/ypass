from sys import stdout

import typer

from ..backends import get_backend
from ..util import PasswordNotFound, PasswordQuery


def delete(
  name: str = typer.Argument(..., help="The name of the password to delete."),
):
  """
  Deletes the password with the given NAME.
  """

  try:
    get_backend().delete(name)
  except PasswordNotFound:
    print(f"Password '{name}' not found.")
    raise typer.Exit(1)  