import { isSplunkLog, toSplunkEvent } from './toSplunkEvent'

import type { SplunkLog } from './toSplunkEvent'
import type SplunkEvents from 'splunk-events'

type WriteLogCallbacks = {
  onSplunkLog?: (log: SplunkLog) => void
}

export const getPinoWriteLog = (
  splunk: SplunkEvents,
  { onSplunkLog = () => {} }: WriteLogCallbacks = {}
) => {
  const log = (chunk: unknown) => {
    if (isSplunkLog(chunk)) {
      onSplunkLog(chunk)

      const event = toSplunkEvent(chunk)

      splunk.logEvent(
        event.severity.level,
        event.severity.type,
        event.workflow.type,
        event.workflow.instance,
        event.data,
        event.account
      )
    } else {
      splunk.logEvent('Important', 'Warn', 'fallback-log', 'invalid-pino-log', {
        msg: chunk as any,
      })
    }
  }

  return log
}
