export type MockWithWaitableCallback = jest.Mock & {
  waitToHaveBeenCalledTimes: (t: number) => Promise<unknown>
}

export function createWaitableMock(): MockWithWaitableCallback {
  let resolve: (value?: unknown) => void
  let times: number
  let calledCount = 0
  const mock = jest.fn() as MockWithWaitableCallback

  mock.mockImplementation(() => {
    calledCount += 1
    if (resolve && calledCount >= times) {
      resolve()
    }
  })

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: This is a useful monkey patch to do
  mock.waitToHaveBeenCalledTimes = (t: number) => {
    times = t

    return new Promise((r) => {
      resolve = r
    })
  }

  return mock
}
