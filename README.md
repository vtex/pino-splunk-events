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
