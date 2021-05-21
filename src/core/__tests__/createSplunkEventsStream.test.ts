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
    describe('and has level 10 (trace)', () => {
      it('calls /services/collector/event with event', async () => {
        const mockedRoute = mockEventRoute()

        const stream = getStream()

        stream.write(
          JSON.stringify({
            level: 10,
            time: Date.now(),
            workflowInstance: 'workflow-instance-10',
            workflowType: 'workflow-type-10',
          })
        )
        stream.write('\n')

        jest.advanceTimersByTime(100)

        await mockedRoute.waitToHaveBeenCalledTimes(1)

        expect(mockedRoute).toHaveBeenCalledWith([
          {
            event: {
              account: '',
              level: 'Debug',
              time: '2021-10-15T00:00:00.000Z',
              type: 'Info',
              workflowInstance: 'workflow-instance-10',
              workflowType: 'workflow-type-10',
            },
            host: '-',
            sourcetype: 'log',
          },
        ])
      })
    })

    describe('and has level 20 (debug)', () => {
      it('calls /services/collector/event with event', async () => {
        const mockedRoute = mockEventRoute()

        const stream = getStream()

        stream.write(
          JSON.stringify({
            level: 20,
            time: Date.now(),
            workflowInstance: 'workflow-instance-20',
            workflowType: 'workflow-type-20',
          })
        )
        stream.write('\n')

        jest.advanceTimersByTime(100)

        await mockedRoute.waitToHaveBeenCalledTimes(1)

        expect(mockedRoute).toHaveBeenCalledWith([
          {
            event: {
              account: '',
              level: 'Debug',
              time: '2021-10-15T00:00:00.000Z',
              type: 'Info',
              workflowInstance: 'workflow-instance-20',
              workflowType: 'workflow-type-20',
            },
            host: '-',
            sourcetype: 'log',
          },
        ])
      })
    })

    describe('and has level 30 (info)', () => {
      it('calls /services/collector/event with event', async () => {
        const mockedRoute = mockEventRoute()

        const stream = getStream()

        stream.write(
          JSON.stringify({
            level: 30,
            time: Date.now(),
            workflowInstance: 'workflow-instance-30',
            workflowType: 'workflow-type-30',
          })
        )
        stream.write('\n')

        jest.advanceTimersByTime(100)

        await mockedRoute.waitToHaveBeenCalledTimes(1)

        expect(mockedRoute).toHaveBeenCalledWith([
          {
            event: {
              account: '',
              level: 'Important',
              time: '2021-10-15T00:00:00.000Z',
              type: 'Info',
              workflowInstance: 'workflow-instance-30',
              workflowType: 'workflow-type-30',
            },
            host: '-',
            sourcetype: 'log',
          },
        ])
      })
    })

    describe('and has level 40 (warn)', () => {
      it('calls /services/collector/event with event', async () => {
        const mockedRoute = mockEventRoute()

        const stream = getStream()

        stream.write(
          JSON.stringify({
            level: 40,
            time: Date.now(),
            workflowInstance: 'workflow-instance-40',
            workflowType: 'workflow-type-40',
          })
        )
        stream.write('\n')

        jest.advanceTimersByTime(100)

        await mockedRoute.waitToHaveBeenCalledTimes(1)

        expect(mockedRoute).toHaveBeenCalledWith([
          {
            event: {
              account: '',
              level: 'Important',
              time: '2021-10-15T00:00:00.000Z',
              type: 'Warn',
              workflowInstance: 'workflow-instance-40',
              workflowType: 'workflow-type-40',
            },
            host: '-',
            sourcetype: 'log',
          },
        ])
      })
    })

    describe('and has level 50 (error)', () => {
      it('calls /services/collector/event with event', async () => {
        const mockedRoute = mockEventRoute()

        const stream = getStream()

        stream.write(
          JSON.stringify({
            level: 50,
            time: Date.now(),
            workflowInstance: 'workflow-instance-50',
            workflowType: 'workflow-type-50',
          })
        )
        stream.write('\n')

        jest.advanceTimersByTime(100)

        await mockedRoute.waitToHaveBeenCalledTimes(1)

        expect(mockedRoute).toHaveBeenCalledWith([
          {
            event: {
              account: '',
              level: 'Important',
              time: '2021-10-15T00:00:00.000Z',
              type: 'Error',
              workflowInstance: 'workflow-instance-50',
              workflowType: 'workflow-type-50',
            },
            host: '-',
            sourcetype: 'log',
          },
        ])
      })
    })

    describe('and has level 60 (fatal)', () => {
      it('calls /services/collector/event with event', async () => {
        const mockedRoute = mockEventRoute()

        const stream = getStream()

        stream.write(
          JSON.stringify({
            level: 60,
            time: Date.now(),
            workflowInstance: 'workflow-instance-60',
            workflowType: 'workflow-type-60',
          })
        )
        stream.write('\n')

        jest.advanceTimersByTime(100)

        await mockedRoute.waitToHaveBeenCalledTimes(1)

        expect(mockedRoute).toHaveBeenCalledWith([
          {
            event: {
              account: '',
              level: 'Critical',
              time: '2021-10-15T00:00:00.000Z',
              type: 'Error',
              workflowInstance: 'workflow-instance-60',
              workflowType: 'workflow-type-60',
            },
            host: '-',
            sourcetype: 'log',
          },
        ])
      })
    })

    describe('and has level 100 (unknown)', () => {
      it('calls /services/collector/event with event', async () => {
        const mockedRoute = mockEventRoute()

        const stream = getStream()

        stream.write(
          JSON.stringify({
            level: 100,
            time: Date.now(),
            workflowInstance: 'workflow-instance-100',
            workflowType: 'workflow-type-100',
          })
        )
        stream.write('\n')

        jest.advanceTimersByTime(100)

        await mockedRoute.waitToHaveBeenCalledTimes(1)

        expect(mockedRoute).toHaveBeenCalledWith([
          {
            event: {
              account: '',
              level: 'Important',
              msg: {
                level: 100,
                time: +new Date('2021-10-15T00:00:00.000Z'),
                workflowInstance: 'workflow-instance-100',
                workflowType: 'workflow-type-100',
              },
              type: 'Warn',
              workflowInstance: 'invalid-pino-log',
              workflowType: 'fallback-log',
            },
            host: '-',
            sourcetype: 'log',
          },
        ])
      })
    })
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
              account: '',
              level: 'Important',
              msg: 'Message encoded as JSON string',
              type: 'Warn',
              workflowInstance: 'invalid-pino-log',
              workflowType: 'fallback-log',
            },
            host: '-',
            sourcetype: 'log',
          },
          {
            event: {
              account: '',
              level: 'Important',
              msg: ['Another message encoded as JSON string'],
              type: 'Warn',
              workflowInstance: 'invalid-pino-log',
              workflowType: 'fallback-log',
            },
            host: '-',
            sourcetype: 'log',
          },
        ])
      })
    })
  })
})
