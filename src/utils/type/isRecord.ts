import { toStringTag } from './toStringTag'

export const isRecord = (value: unknown): value is Record<any, unknown> => {
  return toStringTag(value) === '[object Object]'
}
