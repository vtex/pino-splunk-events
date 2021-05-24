import { LOG_VALUE_TO_LABEL } from './toSplunkEvent'

import type { PinoLevelLabel, SplunkLog } from './toSplunkEvent'

export type ConsoleLevel = Exclude<PinoLevelLabel, 'fatal'>

export const getConsoleLevelFromSplunkLog = (log: SplunkLog) => {
  const levelLabel = LOG_VALUE_TO_LABEL[log.level]
  const consoleLevel = levelLabel === 'fatal' ? 'error' : levelLabel

  return consoleLevel
}
