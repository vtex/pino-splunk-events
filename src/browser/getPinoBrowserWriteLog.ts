import { getPinoWriteLog } from '../core/getPinoWriteLog'
import { LOG_VALUE_TO_LABEL } from '../core/toSplunkEvent'

import type SplunkEvents from 'splunk-events'

export const getPinoBrowserWriteLog = (splunk: SplunkEvents) => {
  return getPinoWriteLog(splunk, {
    onSplunkLog: (log) => {
      const levelLabel = LOG_VALUE_TO_LABEL[log.level]

      const consoleLevel = levelLabel === 'fatal' ? 'error' : levelLabel

      // eslint-disable-next-line no-console
      console[consoleLevel](log)
    },
  })
}
