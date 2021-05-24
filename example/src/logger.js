const pino = require('pino')

const logger = pino({ level: 'trace' }).child({
  workflowType: 'tests',
  workflowInstance: 'example',
})

let count = 0
const levels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal']

setInterval(() => {
  const level = levels[count % levels.length]

  console.info('Message to be discarded')
  logger[level]({ count })
  console.error('Error to be discarded')

  count++
}, 1000)
