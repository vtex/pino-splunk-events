import { isRecord } from '../utils/type/isRecord'

type PinoLevelLabel = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace'

type SplunkSeverity = {
  level: 'Critical' | 'Important' | 'Debug'
  type: 'Error' | 'Warn' | 'Info'
}

const LOG_VALUE_TO_LABEL: Record<number, PinoLevelLabel> = {
  10: 'trace',
  20: 'debug',
  30: 'info',
  40: 'warn',
  50: 'error',
  60: 'fatal',
}

const LOG_LABEL_TO_SPLUNK_SEVERITY: Record<PinoLevelLabel, SplunkSeverity> = {
  trace: { level: 'Debug', type: 'Info' },
  debug: { level: 'Debug', type: 'Info' },
  info: { level: 'Important', type: 'Info' },
  warn: { level: 'Important', type: 'Warn' },
  error: { level: 'Important', type: 'Error' },
  fatal: { level: 'Critical', type: 'Error' },
}

type PinoLog = Record<any, unknown> & {
  level: number
  time: number
}

type SplunkLog = PinoLog & {
  workflowType?: string
  workflowInstance?: string
}

export const isPinoLog = (value: unknown): value is PinoLog => {
  return (
    isRecord(value) &&
    typeof value.time === 'number' &&
    typeof value.level === 'number' &&
    value.level in LOG_VALUE_TO_LABEL
  )
}

export const isSplunkLog = (value: unknown): value is SplunkLog => {
  return (
    isPinoLog(value) &&
    (typeof value.workflowType === 'string' ||
      typeof value.workflowType === 'undefined') &&
    (typeof value.workflowInstance === 'string' ||
      typeof value.workflowInstance === 'undefined')
  )
}

export const toSplunkEvent = (log: SplunkLog) => {
  const { level, time, workflowInstance, workflowType, ...eventData } = log

  const levelLabel = LOG_VALUE_TO_LABEL[level]
  const severity = LOG_LABEL_TO_SPLUNK_SEVERITY[levelLabel]

  return {
    severity,
    workflow: {
      type: workflowType ?? '',
      instance: workflowInstance ?? '',
    },
    data: {
      time: new Date(time).toISOString(),
      ...eventData,
    },
  }
}