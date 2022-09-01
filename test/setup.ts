import { afterAll, afterEach, beforeAll } from 'vitest'
import fetch from 'node-fetch'

import { server } from './mocks/server'

beforeAll(() => {
  // Currently msw didn't support undici. https://github.com/mswjs/interceptors/issues/159
  // Use `node-fetch` as a temporary fallback.
  Object.assign(global, { fetch })

  server.listen({ onUnhandledRequest: 'bypass' })
})

afterAll(() => server.close())

afterEach(() => server.resetHandlers())
