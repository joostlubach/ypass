from typing import Optional

import typer


def stdin_or_value(stdin: bool, value: Optional[str], err_if_missing: Optional[str] = None):
  if stdin:
    value = typer.get_text_stream('stdin').read().rstrip('\n')
  if value is None and err_if_missing:
    raise typer.BadParameter(err_if_missing)

  return value