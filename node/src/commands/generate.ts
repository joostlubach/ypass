import PasswordGenerator from '../PasswordGenerator'

export default function generate(length: number) {
  const generator = new PasswordGenerator()
  const password  = generator.generatePassword(length)
  process.stdout.write(password + '\n')
}