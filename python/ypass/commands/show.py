from sys import stdout

import typer

from ..backends import get_backend
from ..util import PasswordNotFound, PasswordQuery


def show(
  name: str = typer.Argument(..., help="The name of the password to show."),
):
  """
  Shows the password with the given NAME.
  """

  query     = PasswordQuery(name = name)

  try:
    password = get_backend().show(query)
    stdout.write(password.password or '')
    stdout.write('\n')
  except PasswordNotFound:
    print(f"Password '{name}' not found.")
    raise typer.Exit(1)