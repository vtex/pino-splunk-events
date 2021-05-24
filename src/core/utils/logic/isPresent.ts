export const isPresent = (record: Record<any, unknown>) => {
  return Object.keys(record).length !== 0
}
