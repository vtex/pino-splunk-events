import { isSplunkLog } from './toSplunkEvent'
import { isPresent } from './utils/logic/isPresent'
import { formatTime } from './utils/time/formatTime'
import { omit } from './utils/object/omit'
import { getConsoleLevelFromSplunkLog } from './ConsoleLevel'

import type { ConsoleLevel } from './ConsoleLevel'
import type { SplunkLog } from './toSplunkEvent'

const messageFormatSplunkLog = (log: SplunkLog) => {
  if (log.workflowType) {
    return `[${log.workflowType}] ${log.msg}`
  }

  return log.msg ?? ''
}

const messageFormat = (log: Record<any, unknown>) => {
  if (isSplunkLog(log)) {
    return messageFormatSplunkLog(log)
  }

  return ''
}

const defaultIgnore = ['level', 'time', 'msg', 'account', 'workflowType']

const print = (log: unknown, level?: ConsoleLevel, ignore = defaultIgnore) => {
  if (isSplunkLog(log)) {
    const messages = []
    const logLevel = level ?? getConsoleLevelFromSplunkLog(log)

    messages.push(
      `[${formatTime(new Date(log.time))}]: ${messageFormatSplunkLog(log)}`
    )

    const event = omit(ignore, log)

    if (isPresent(event)) {
      messages.push(event)
    }

    // eslint-disable-next-line no-console
    console[logLevel](...messages)
  } else {
    console.error(log)
  }
}

export const PrettyConsole = { messageFormat, print, defaultIgnore }
