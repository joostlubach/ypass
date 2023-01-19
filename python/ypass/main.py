from types import SimpleNamespace

import typer

from ypass.formatters import Format

from .commands import *

app = typer.Typer()
app.command()(list)
app.command()(add)

@app.callback()
def main(
  ctx:    typer.Context,
  format: Format = typer.Option(Format.text, envvar='YPASS_FORMAT'),
):
  ctx.obj = SimpleNamespace(
    formatter = format.get_formatter(),
  )