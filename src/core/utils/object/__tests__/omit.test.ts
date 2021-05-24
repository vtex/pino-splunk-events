import { omit } from '../omit'

describe('omit', () => {
  describe('when object has keys', () => {
    it('returns object without keys', () => {
      const object = { first: 'value-1', second: 'value-2', keepKey: 'value-3' }

      expect(omit(['first', 'second'], object)).toEqual({
        keepKey: 'value-3',
      })
    })
  })
})
