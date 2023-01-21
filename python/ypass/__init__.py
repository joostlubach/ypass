import builtins

import rich
import typer

from .main import app

builtins.print = rich.print # type: ignore[assignment]

if __name__ == "__main__":
  typer.run(app)