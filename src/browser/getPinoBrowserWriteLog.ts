import { getPinoWriteLog } from '../core/getPinoWriteLog'
import { LOG_VALUE_TO_LABEL } from '../core/toSplunkEvent'
import { PrettyConsole } from '../core/PrettyConsole'

import type { ConsoleLevel } from '../core/PrettyConsole'
import type { SplunkLog } from '../core/toSplunkEvent'
import type SplunkEvents from 'splunk-events'

type BrowserWriteLogCallbacks = {
  onConsoleLog?: (level: ConsoleLevel, log: SplunkLog) => void
}

export const getPinoBrowserWriteLog = (
  splunk: SplunkEvents,
  { onConsoleLog = PrettyConsole.print }: BrowserWriteLogCallbacks = {}
) => {
  return getPinoWriteLog(splunk, {
    onSplunkLog: (log) => {
      const levelLabel = LOG_VALUE_TO_LABEL[log.level]
      const consoleLevel = levelLabel === 'fatal' ? 'error' : levelLabel

      onConsoleLog(consoleLevel, log)
    },
  })
}
