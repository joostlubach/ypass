from typing import Optional


class Password:

  name:       str
  password:   Optional[str]
  attributes: dict[str, str]

  def __init__(self, name: str, password: Optional[str] = None):
    self.name = name
    self.password = password
    self.attributes = {}

  def setattr(self, name: str, value: str):
    self.attributes[name] = value

  def getattr(self, name: str):
    try:
      return self.attributes[name]
    except KeyError:
      return None