import { Execution } from '~/util'

export class UnsupportedPlatformError extends Error {

  constructor() {
    super("Your platform does not support KeychainBackend.")
  }

}

export class LocatorNotFoundError extends Error {

  constructor() {
    super("The specified password does not contain the correct locator type")
  }

}

export class InvalidLocatorError extends Error {

  constructor() {
    super("The specified password locator is not of the correct type")
  }

}

export class ExecutionError extends Error {

  constructor(execution: Execution) {
    super(`Error while exuecuting ${execution.command}. Run with --verbose to get more info.`)
  }

}