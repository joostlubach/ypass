import typer

FormatArgument = typer.Option('text', envvar='YPASS_FORMAT', help="The format to use for output.")
StdInArgument  = typer.Option(False, '-i', '--stdin', help="If set, will read the password from STDIN instead of as an argument.")