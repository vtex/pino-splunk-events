import { getPinoWriteLog } from '../core/getPinoWriteLog'
import { LOG_VALUE_TO_LABEL } from '../core/toSplunkEvent'

import type { PinoLevelLabel, SplunkLog } from '../core/toSplunkEvent'
import type SplunkEvents from 'splunk-events'

type ConsoleLevel = Exclude<PinoLevelLabel, 'fatal'>

type BrowserWriteLogCallbacks = {
  onConsoleLog?: (level: ConsoleLevel, log: SplunkLog) => void
}

const defaultLog: BrowserWriteLogCallbacks['onConsoleLog'] = (level, log) => {
  // eslint-disable-next-line no-console
  console[level](log)
}

export const getPinoBrowserWriteLog = (
  splunk: SplunkEvents,
  { onConsoleLog = defaultLog }: BrowserWriteLogCallbacks = {}
) => {
  return getPinoWriteLog(splunk, {
    onSplunkLog: (log) => {
      const levelLabel = LOG_VALUE_TO_LABEL[log.level]
      const consoleLevel = levelLabel === 'fatal' ? 'error' : levelLabel

      onConsoleLog(consoleLevel, log)
    },
  })
}
