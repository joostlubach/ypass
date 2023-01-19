import * as Path from 'path'

const paths = {
  root:   resolveApp('.'),
  config: resolveApp('config'),
  src:    resolveApp('src'),
  logs:   resolveApp('logs'),

  dotenv: resolveApp('../.env'),
}
export default paths

//------
// Support

function resolveApp(relative: string) {
  return Path.resolve(__dirname, '..', relative)
}