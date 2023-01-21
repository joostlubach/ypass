from typing import Optional

from typer import Option

from ypass.password import Password


class PasswordQuery:

  name: Optional[str]

  def __init__(self, /, name: Optional[str] = None):
    if name:
      self.name = name.lower()
    else:
      self.name = None

  def match(self, password: Password):
    if self.name and not (self.name in password.name.lower()):
      return False

    return True