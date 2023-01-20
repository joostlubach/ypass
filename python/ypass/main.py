import typer

from .commands import *

app = typer.Typer()
app.command()(list)
app.command()(add)
app.command()(show)