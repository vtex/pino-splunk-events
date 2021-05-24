import { isPresent } from '../isPresent'

describe('isPresent', () => {
  describe('when object has own keys', () => {
    it('returns true', () => {
      const object = { key: 'value' }

      expect(isPresent(object)).toBe(true)
    })
  })

  describe("when object doesn't has own keys", () => {
    it('returns false', () => {
      const object = {}

      expect(isPresent(object)).toBe(false)
    })
  })
})
