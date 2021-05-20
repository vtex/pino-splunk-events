import split from 'split2'
import Pumpify from 'pumpify'
import through from 'through2'

import { isSplunkLog, toSplunkEvent } from './toSplunkEvent'

import type SplunkEvents from 'splunk-events'

export const createSplunkEventsStream = (splunk: SplunkEvents) => {
  const logChunk = (chunk: unknown) => {
    if (isSplunkLog(chunk)) {
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

  const writeStream = new Pumpify(
    split((line) => {
      try {
        return JSON.parse(line)
      } catch (e) {
        return undefined
      }
    }),
    through.obj((chunk: unknown, _enc, next) => {
      logChunk(chunk)
      next()
    })
  )

  writeStream.on('error', (error) => {
    console.error('[pino-splunk-events] Write stream error:', error)
  })

  return writeStream
}
