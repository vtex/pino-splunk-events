export const toStringTag = (value: unknown) => {
  return Object.prototype.toString.call(value)
}
