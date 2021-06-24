import MockDate from 'mockdate'

import { PrettyConsole } from '../PrettyConsole'

describe('PrettyConsole', () => {
  beforeEach(() => {
    MockDate.set('2021-10-15')
  })

  afterEach(() => {
    MockDate.reset()
  })

  describe('#print', () => {
    describe('when the event is some pino log', () => {
      it('calls console with formatted message', () => {
        const consoleLog = jest
          .spyOn(console, 'info')
          .mockImplementation(() => {})

        PrettyConsole.print({
          level: 30,
          time: Date.now(),
          msg: 'Hello world!',
        })

        expect(consoleLog).toBeCalledWith(
          '[2021-10-14 21:00:00.000 -0300]: Hello world!'
        )
      })
    })

    describe('when the event is some splunk log', () => {
      it('calls console with formatted message', () => {
        const consoleLog = jest
          .spyOn(console, 'info')
          .mockImplementation(() => {})

        PrettyConsole.print({
          level: 30,
          time: Date.now(),
          msg: 'Hello world!',
          workflowType: 'splunk',
          workflowInstance: 'user-gtk',
          account: 'physical-stores',
          layer: 'jest-tests',
        })

        expect(consoleLog).toBeCalledWith(
          '[2021-10-14 21:00:00.000 -0300]: [splunk] Hello world!',
          { workflowInstance: 'user-gtk', layer: 'jest-tests' }
        )
      })

      describe("and doesn't have msg property", () => {
        it('calls console with formatted message', () => {
          const consoleLog = jest
            .spyOn(console, 'info')
            .mockImplementation(() => {})

          PrettyConsole.print({
            level: 30,
            time: Date.now(),
            workflowType: 'splunk',
            workflowInstance: 'user-gtk',
            account: 'physical-stores',
            layer: 'jest-tests',
          })

          expect(consoleLog).toBeCalledWith(
            '[2021-10-14 21:00:00.000 -0300]: [splunk]',
            { workflowInstance: 'user-gtk', layer: 'jest-tests' }
          )
        })
      })
    })
  })
})
