import { Command } from 'commander'
import { generate, list, remove, show, store } from './commands'
import { setVerbose } from './util'

const command = new Command('yarn svg')

command
  .command('list')
  .description("Lists your passwords.")
  .action(list)

command
  .command('show')
  .argument('name', "The name of the password to retrieve")
  .description("Shows a password.")
  .action(show)

command
  .command('store')
  .argument('name', "The name of the password")
  .argument('password', "The password to store")
  .description("Stores a password.")
  .action(store)

command
  .command('remove')
  .argument('name', "The name of the password")
  .description("Removes a password.")
  .action(remove)

command
  .command('generate')
  .argument('[length]', "The length of the password to generate", 20)
  .description("Generates a password.")
  .action(generate)

command.option('-v, --verbose', "Be more verbose")
command.hook('preAction', () => {
  setVerbose(command.getOptionValue('verbose') ?? false)
})

command.parse(process.argv)