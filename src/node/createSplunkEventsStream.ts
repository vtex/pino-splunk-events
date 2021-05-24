import split from 'split2'
import Pumpify from 'pumpify'
import through from 'through2'

import { getPinoWriteLog } from '../core/getPinoWriteLog'

import type SplunkEvents from 'splunk-events'

export const createSplunkEventsStream = (splunk: SplunkEvents) => {
  const log = getPinoWriteLog(splunk)

  const writeStream = new Pumpify(
    split((line) => {
      try {
        return JSON.parse(line)
      } catch (e) {
        return undefined
      }
    }),
    through.obj((chunk: unknown, _enc, next) => {
      log(chunk)
      next()
    })
  )

  writeStream.on('error', (error) => {
    console.error('[pino-splunk-events] Write stream error:', error)
  })

  return writeStream
}
