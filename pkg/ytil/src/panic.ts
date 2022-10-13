export function panic(msg: string, exitCode: number = 99): never {
  process.stderr.write(msg + '\n')
  process.exit(exitCode)
}