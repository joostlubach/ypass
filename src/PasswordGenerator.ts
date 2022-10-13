export default class PasswordGenerator {

  public generatePassword(length: number) {
    let password: string = ''
    while (password.length < length) {
      password += CHARS[Math.floor(Math.random() * CHARS.length)]
    }
    return password
  }

}

const CHARS = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*=+,.?'.split('')
