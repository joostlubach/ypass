import typer

from ypass import password

from .commands import *

app = typer.Typer()
app.command()(list)
app.command()(add)
app.command()(show)
app.command()(delete)
app.command()(update)