![npm](https://img.shields.io/npm/v/pino-splunk-events)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
![GitHub](https://img.shields.io/github/license/vtex/pino-splunk-events)

---

# pino-splunk-events

### Install

```bash
$ npm install pino-splunk-events
```

### Usage

```bash
$ node app.js | npx pino-splunk-events --endpoint=YOUR_SPLUNK_ENDPOINT --token=YOUR_SPLUNK_TOKEN
```

#### Node (development mode)

```ts
import { PrettyConsole } from 'pino-splunk-events/lib/core/PrettyConsole'

const logger = pino({
  prettyPrint: {
    messageFormat: PrettyConsole.messageFormat,
  },
})
```

#### Browser (production mode)

```ts
import { getPinoBrowserWriteLog } from 'pino-splunk-events/lib/browser'
import SplunkEvents from 'splunk-events'
import pino from 'pino'

const splunk = new SplunkEvents({
  endpoint: process.env.SPLUNK_ENDPOINT,
  token: process.env.SPLUNK_TOKEN,

  // IMPORTANT! You need to set this flag
  // to permit send nested data to splunk
  // otherwise it will fails when try to
  // send some log with nested data
  shouldParseEventData: false,
})

const logger = pino({
  browser: {
    write: getPinoBrowserWriteLog(splunk),
  },
})
```

#### Browser (development mode)

```ts
import { PrettyConsole } from 'pino-splunk-events/lib/core/PrettyConsole'
import pino from 'pino'

const logger = pino({
  browser: {
    write: PrettyConsole.print,
  },
})
```

### Table logs level to splunk

| Log Level | Splunk Query               |
| --------- | -------------------------- |
| trace     | level=Debug type=Info      |
| debug     | level=Debug type=Info      |
| info      | level=Important type=Info  |
| warn      | level=Important type=Warn  |
| error     | level=Important type=Error |
| fatal     | level=Critical type=Error  |

### Running example

```bash
# terminal 1
$ yarn install
$ cd example && yarn install
# starts fake splunk server
$ yarn server:start

# terminal 2
# sends events to fake splunk server
$ yarn logger:start
```

### Deploy / Release new tags

Use `npx chan added|fixed|etc "my change"`

And after setting a changelog, run:

```shell
yarn release
```

## License

Released under [MIT License](./LICENSE).
