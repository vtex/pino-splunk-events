import pino from 'pino'

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

/**
 * Must have compatibility with WriteFn type of pino
 */
pino({
  browser: {
    write: PrettyConsole.print,
  },
})
