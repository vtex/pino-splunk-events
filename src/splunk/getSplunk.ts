import SplunkEvents from 'splunk-events'
import axios from 'axios'

import type { Config } from 'splunk-events'

export const getSplunk = (config: Config) =>
  new SplunkEvents({
    shouldParseEventData: false,
    debounceTime: 0,
    request: axios as any,
    ...config,
  })
