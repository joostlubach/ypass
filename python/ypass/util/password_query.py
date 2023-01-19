from typing import Optional

from typer import Option

from ypass.password import Password


class PasswordQuery:

  filter: Optional[str]

  def __init__(self, /, filter: Optional[str]):
    if filter:
      self.filter = filter.lower()
    else:
      self.filter = None

  def match(self, password: Password):
    # if self.filter and not (self.filter in password.account.lower()):
    #   return False

    return True