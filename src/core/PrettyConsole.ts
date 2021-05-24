import { isSplunkLog } from './toSplunkEvent'
import { isPresent } from './utils/logic/isPresent'
import { formatTime } from './utils/time/formatTime'
import { omit } from './utils/object/omit'

import type { PinoLevelLabel, SplunkLog } from './toSplunkEvent'

export type ConsoleLevel = Exclude<PinoLevelLabel, 'fatal'>

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

const print = (level: ConsoleLevel, log: unknown, ignore = defaultIgnore) => {
  const messages = []

  if (isSplunkLog(log)) {
    messages.push(
      `[${formatTime(new Date(log.time))}]: ${messageFormatSplunkLog(log)}`
    )

    const event = omit(ignore, log)

    if (isPresent(event)) {
      messages.push(event)
    }
  } else {
    messages.push(log)
  }

  // eslint-disable-next-line no-console
  console[level](...messages)
}

export const PrettyConsole = { messageFormat, print, defaultIgnore }
