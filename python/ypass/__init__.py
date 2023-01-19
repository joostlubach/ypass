import builtins

import rich

builtins.print = rich.print # type: ignore[assignment]
