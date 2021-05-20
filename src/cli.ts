#!/usr/bin/env node

import { Command, flags } from '@oclif/command'
import { handle as handleErrors } from '@oclif/errors'

import { createSplunkEventsStream } from './splunk/createSplunkEventsStream'
import { getSplunk } from './splunk/getSplunk'

class PinoSplunkEvents extends Command {
  public static description = 'Log events to splunk'

  public static flags = {
    endpoint: flags.string({
      description: 'Endpoint of your Splunk server',
      required: true,
    }),
    token: flags.string({
      description: 'Token used to authenticate with the Splunk server',
      required: true,
    }),
  }

  public async run() {
    const parsed = this.parse(PinoSplunkEvents)

    const splunk = getSplunk(parsed.flags)
    const writeStream = createSplunkEventsStream(splunk)

    process.stdin.pipe(process.stdout)
    process.stdin.pipe(writeStream)
  }
}

PinoSplunkEvents.run().then(null, handleErrors)
