export const omit = <
  TObject extends Record<any, unknown>,
  TKeys extends keyof TObject
>(
  keys: TKeys[],
  object: TObject
): Omit<TObject, TKeys> => {
  return Object.keys(object).reduce((reduced, key) => {
    if (!(keys as string[]).includes(key)) {
      reduced[key] = object[key]
    }

    return reduced
  }, {} as any)
}
