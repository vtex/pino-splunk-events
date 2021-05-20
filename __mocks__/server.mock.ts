import { rest } from 'msw'
import { setupServer } from 'msw/node'

import type {
  RestRequest,
  DefaultRequestBody,
  RequestParams,
  ResponseComposition,
  RestContext,
} from 'msw'

type HandlerReturn = ReturnType<Parameters<typeof rest.get>[1]>

export type Handler<BodyType extends DefaultRequestBody> = (
  req: RestRequest<BodyType, RequestParams>,
  res: ResponseComposition<BodyType>,
  context: RestContext
) => HandlerReturn

export type FallbackType = {
  warnMessage: string
  context: string
}

const fallbackRoute = '*'

const fallbackHandler: Handler<FallbackType> = (req, res, ctx) => {
  const warnMessage = `You didnt explicit mocked ${req.method.toUpperCase()} ${
    req.url
  } request`

  console.warn(warnMessage)

  return res(
    ctx.status(404),
    ctx.json({
      warnMessage,
      context:
        'This error was thrown by fallbackHandler of file __mocks__/server.mock.ts',
    })
  )
}

export const server = setupServer(
  rest.get<FallbackType>(fallbackRoute, fallbackHandler),
  rest.post<FallbackType>(fallbackRoute, fallbackHandler),
  rest.put<FallbackType>(fallbackRoute, fallbackHandler),
  rest.patch<FallbackType>(fallbackRoute, fallbackHandler)
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
