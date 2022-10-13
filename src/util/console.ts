import chalk from 'chalk'
import { isFunction } from 'lodash'
import * as Readline from 'readline'
import stripAnsi from 'strip-ansi'
import { getLastExecution } from './exec'

export function task(log: string, arg: any) {
  const pad = _verbose ? '\n' : Array(Math.max(0, 60 - stripAnsi(log).length) + 1).join(' ')
  process.stdout.write(log + pad)

  const promise = isFunction(arg) ? arg() : arg

  return promise.then(
    (retval: any) => {
      if (retval === false) {
        process.stdout.write(chalk`{yellow [  Skip  ]}\n`)
      } else {
        process.stdout.write(chalk`{green [   OK   ]}\n`)
      }
    },
    (error: Error) => {
      const {command, exitCode, stdout, stderr} = getLastExecution()

      process.stdout.write(chalk`{red [ Error ]}\n`)
      if (command == null || exitCode === 0) {
        process.stderr.write(`Error occurred: ${error.stack}\n`)
      } else {
        process.stderr.write(chalk`Failed with exit code ${exitCode}: {underline ${command}}\n`)
        if (stdout != null) {
          process.stderr.write("---- Output (stdout) ----\n")
          process.stderr.write(chalk.dim(stdout))
        }
        if (stderr != null) {
          process.stderr.write("---- Output (stderr) ----\n")
          process.stderr.write(chalk.red(stderr))
        }
      }

      process.exit(1)
    }
  )
}

export async function confirm(prompt: string) {
  return new Promise(resolve => {
    const readline = Readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    readline.question(chalk`⚠️  ${prompt} {dim [no]} `, answer => {
      resolve(answer === 'yes')
      readline.close()
    })
  })
}

export function ask(question: string) {
  const readline = Readline.createInterface({
    input:  process.stdin,
    output: process.stdout,
  })

  return new Promise(resolve => {
    readline.question(question, answer => {
      resolve(answer)
      readline.close()
    })
  })
}

let _verbose = false

export function setVerbose(verbose: boolean) {
  _verbose = verbose
}

export function getVerbose() {
  return _verbose
}