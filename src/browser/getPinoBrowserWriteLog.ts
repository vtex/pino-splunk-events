import { getPinoWriteLog } from '../core/getPinoWriteLog'
import { PrettyConsole } from '../core/PrettyConsole'
import { getConsoleLevelFromSplunkLog } from '../core/ConsoleLevel'

import type { ConsoleLevel } from '../core/ConsoleLevel'
import type { SplunkLog } from '../core/toSplunkEvent'
import type SplunkEvents from 'splunk-events'

type BrowserWriteLogCallbacks = {
  onConsoleLog?: (log: SplunkLog, level: ConsoleLevel) => void
}

const defaultLog = PrettyConsole.print

export const getPinoBrowserWriteLog = (
  splunk: SplunkEvents,
  { onConsoleLog = defaultLog }: BrowserWriteLogCallbacks = {}
) => {
  return getPinoWriteLog(splunk, {
    onSplunkLog: (log) => {
      const consoleLevel = getConsoleLevelFromSplunkLog(log)

      onConsoleLog(log, consoleLevel)
    },
  })
}
