import MockDate from 'mockdate'
import { rest } from 'msw'
import ndjsonParse from 'ndjson-parse'

import { createSplunkEventsStream } from '../../node/createSplunkEventsStream'
import { server } from '../../../__mocks__/server.mock'
import { createWaitableMock } from '../../../test/utils/jest'
import { getSplunk } from '../getSplunk'

jest.useFakeTimers()

describe('createSplunkEventsStream', () => {
  beforeEach(() => {
    MockDate.set('2021-10-15')
  })

  afterEach(() => {
    MockDate.reset()
  })

  const mockEventRoute = () => {
    const waitable = createWaitableMock()

    server.use(
      rest.post(
        'http://localhost:8088/services/collector/event',
        (req, res, ctx) => {
          waitable(
            typeof req.body === 'string' ? ndjsonParse(req.body) : req.body
          )

          return res(ctx.status(200))
        }
      )
    )

    return waitable
  }

  const getStream = () => {
    const splunk = getSplunk({
      endpoint: 'http://localhost:8088',
      token: 'splunk-token',
    })

    return createSplunkEventsStream(splunk)
  }

  describe('when the event is some pino log', () => {
    const useCases = [
      {
        level: {
          value: 10,
          label: 'trace',
        },
        expectedEvent: {
          level: 'Debug',
          type: 'Info',
          workflowInstance: 'workflow-instance-10',
          workflowType: 'workflow-type-10',
          account: '',
          time: '2021-10-15T00:00:00.000Z',
        },
      },

      {
        level: {
          value: 20,
          label: 'debug',
        },
        expectedEvent: {
          level: 'Debug',
          type: 'Info',
          workflowInstance: 'workflow-instance-20',
          workflowType: 'workflow-type-20',
          account: '',
          time: '2021-10-15T00:00:00.000Z',
        },
      },

      {
        level: {
          value: 30,
          label: 'info',
        },
        expectedEvent: {
          level: 'Important',
          type: 'Info',
          workflowInstance: 'workflow-instance-30',
          workflowType: 'workflow-type-30',
          account: '',
          time: '2021-10-15T00:00:00.000Z',
        },
      },

      {
        level: {
          value: 40,
          label: 'warn',
        },
        expectedEvent: {
          level: 'Important',
          type: 'Warn',
          workflowInstance: 'workflow-instance-40',
          workflowType: 'workflow-type-40',
          account: '',
          time: '2021-10-15T00:00:00.000Z',
        },
      },

      {
        level: {
          value: 50,
          label: 'error',
        },
        expectedEvent: {
          level: 'Important',
          type: 'Error',
          workflowInstance: 'workflow-instance-50',
          workflowType: 'workflow-type-50',
          account: '',
          time: '2021-10-15T00:00:00.000Z',
        },
      },

      {
        level: {
          value: 60,
          label: 'fatal',
        },
        expectedEvent: {
          level: 'Critical',
          type: 'Error',
          workflowInstance: 'workflow-instance-60',
          workflowType: 'workflow-type-60',
          account: '',
          time: '2021-10-15T00:00:00.000Z',
        },
      },

      {
        level: {
          value: 100,
          label: 'unknown',
        },
        expectedEvent: {
          level: 'Important',
          type: 'Warn',
          workflowInstance: 'invalid-pino-log',
          workflowType: 'fallback-log',
          account: '',
          msg: {
            level: 100,
            time: +new Date('2021-10-15T00:00:00.000Z'),
            workflowInstance: 'workflow-instance-100',
            workflowType: 'workflow-type-100',
          },
        },
      },
    ]

    for (const { level, expectedEvent } of useCases) {
      describe(`and has level ${level.value} (${level.label})`, () => {
        it('calls /services/collector/event with event', async () => {
          const mockedRoute = mockEventRoute()

          const stream = getStream()

          stream.write(
            JSON.stringify({
              level: level.value,
              time: Date.now(),
              workflowInstance: `workflow-instance-${level.value}`,
              workflowType: `workflow-type-${level.value}`,
            })
          )
          stream.write('\n')

          jest.advanceTimersByTime(100)

          await mockedRoute.waitToHaveBeenCalledTimes(1)

          expect(mockedRoute).toHaveBeenCalledWith([
            {
              event: expectedEvent,
              host: '-',
              sourcetype: 'log',
            },
          ])
        })
      })
    }
  })

  describe('when has events with valid JSON', () => {
    describe('and other events as simple text', () => {
      it('calls /services/collector/event only with events with valid JSON', async () => {
        const mockedRoute = mockEventRoute()

        const stream = getStream()

        stream.write(JSON.stringify('Message encoded as JSON string'))
        stream.write('\n')
        stream.write('Simple text like some console.log output')
        stream.write('\n')
        stream.write(JSON.stringify(['Another message encoded as JSON string']))
        stream.write('\n')

        jest.advanceTimersByTime(100)

        await mockedRoute.waitToHaveBeenCalledTimes(1)

        expect(mockedRoute).toHaveBeenCalledWith([
          {
            event: {
              level: 'Important',
              type: 'Warn',
              workflowInstance: 'invalid-pino-log',
              workflowType: 'fallback-log',
              account: '',
              msg: 'Message encoded as JSON string',
            },
            host: '-',
            sourcetype: 'log',
          },
          {
            event: {
              level: 'Important',
              type: 'Warn',
              workflowInstance: 'invalid-pino-log',
              workflowType: 'fallback-log',
              account: '',
              msg: ['Another message encoded as JSON string'],
            },
            host: '-',
            sourcetype: 'log',
          },
        ])
      })
    })
  })
})
