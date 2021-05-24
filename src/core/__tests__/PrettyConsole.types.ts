import { PrettyConsole } from '../PrettyConsole'

import type { PrettyOptions } from 'pino'

/**
 * Must have compatibility with PrettyOptions type of pino-pretty
 */
{
  const options: PrettyOptions = {
    messageFormat: PrettyConsole.messageFormat,
  }

  console.info(options)
}
