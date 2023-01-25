from hashlib import sha1
from typing import Iterable

from rich.console import Console
from rich.table import Table

from ..formatters.formatter import Formatter
from ..password import Password


class TableFormatter(Formatter):

  def print_list(self, passwords: Iterable[Password]):
    table = Table(title="Passwords")
    if self.mode == Formatter.Mode.NAME_ONLY or self.mode == Formatter.Mode.NAME_AND_PASSWORD:
      table.add_column("Name", style="cyan")
    if self.mode == Formatter.Mode.PASSWORD_ONLY or self.mode == Formatter.Mode.NAME_AND_PASSWORD:
      table.add_column("Password", style="magenta")

    for password in passwords:
      if self.mode == Formatter.Mode.NAME_ONLY:
        table.add_row(password.name)
      elif self.mode == Formatter.Mode.PASSWORD_ONLY:
        table.add_row(password.password)
      else:
        table.add_row(password.name, password.password)

    console = Console()
    console.print(table)

  def print_single(self, password: Password):
    table = Table(title="Passwords")
    if self.mode == Formatter.Mode.NAME_ONLY or self.mode == Formatter.Mode.NAME_AND_PASSWORD:
      table.add_column("Name", style="cyan")
    if self.mode == Formatter.Mode.PASSWORD_ONLY or self.mode == Formatter.Mode.NAME_AND_PASSWORD:
      table.add_column("Password", style="magenta")

    if self.mode == Formatter.Mode.NAME_ONLY:
      table.add_row(password.name)
    elif self.mode == Formatter.Mode.PASSWORD_ONLY:
      table.add_row(password.password)
    else:
      table.add_row(password.name, password.password)

    console = Console()
    console.print(table)
