import chalk from 'chalk'
import { Options as ChildProcessPromiseOptions, spawn } from 'child-process-promise'
import { SpawnOptions } from 'child_process'
import { getVerbose } from './console'

export interface Execution {
  command:  string | null
  exitCode: number | null
  stdout:   string | null
  stderr:   string | null
}

export interface Options extends ChildProcessPromiseOptions, SpawnOptions {
  cwd?:    string
  throws?: boolean
}

let lastExecution: Execution = {
  command:  null,
  exitCode: null,
  stdout:   null,
  stderr:   null,
}

export function exec(cmd: string, args: string[], options: Options = {}): Promise<Execution> {
  const {
    throws = false,
    ...spawnOptions
  } = options

  const command = `${cmd} ${args.join(' ')}`

  const promise = spawn(cmd, args, {
    capture: ['stderr'],
    ...spawnOptions,
  })
  const verbose = getVerbose()

  let stdout = ''
  let stderr = ''

  let writtenCommand = false
  function writeCommand() {
    if (writtenCommand) { return }
    process.stdout.write(chalk.dim(`$ ${command}`) + '\n')
    writtenCommand = true
  }

  const {stdout: childProcessStdout, stderr: childProcessStderr} = promise.childProcess

  if (childProcessStdout != null) {
    childProcessStdout.on('data', data => {
      const utf8 = data.toString('utf8')
      if (verbose) {
        writeCommand()
        for (const line of utf8.split('\n')) {
          process.stdout.write(chalk.dim`OUT: ${line}\n`)
        }
      }
      stdout += utf8
    })
  }

  if (childProcessStderr != null) {
    childProcessStderr.on('data', data => {
      const utf8 = data.toString('utf8')
      if (verbose) {
        writeCommand()
        for (const line of utf8.split('\n')) {
          process.stdout.write(chalk.dim`ERR: ${line}\n`)
        }
      }
      stderr += utf8
    })
  }

  if (verbose) {
    writeCommand()
  }

  function setLastExecution(exitCode: number) {
    return lastExecution = {
      command,
      exitCode,
      stdout: stdout === '' ? null : stdout,
      stderr: stderr === '' ? null : stderr,
    }
  }

  return promise.then(() => {
    return setLastExecution(0)
  }, error => {
    if (!throws && error.name === 'ChildProcessError') {
      return setLastExecution(error.code)
    } else {
      throw error
    }
  })
}

export function getLastExecution() {
  return lastExecution
}