from sys import stdout

import typer

from ..backends import get_backend
from ..formatters import Format
from ..util import PasswordQuery


def show(
  name:        str           = typer.Argument(..., help="The name of the password to show."),
):
  """
  Shows the password with the given NAME.
  """

  query     = PasswordQuery(name = name)
  password = get_backend().show(query)

  if password is None:
    print(f"Password '{name}' not found.")
    raise typer.Exit(1)
  else:
    stdout.write(password.password or '')
    stdout.write('\n')