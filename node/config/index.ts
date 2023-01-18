import packageJSON from '../package.json'
import environment from './environment'
import paths from './paths'

export interface Config {
  version:     string
  environment: typeof environment
  paths:       typeof paths
}

const config: Config = {
  version:     packageJSON.version,
  environment: environment,
  paths:       paths,
}

export default config