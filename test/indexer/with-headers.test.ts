import { describe, expect, test, vi } from 'vitest'
import { createIndexer, withHeaders } from '../../src'

const indexer = createIndexer()

describe('with-headers', () => {
  test('headers', async () => {
    const fakeResponse = { result: true }
    const headers = {
      'x-my-header': 'foo',
    }
    const fakeFetch = vi.fn<Parameters<typeof fetch>>(() =>
      Promise.resolve(new Response(JSON.stringify(fakeResponse))),
    )
    vi.stubGlobal('fetch', fakeFetch)

    const result = withHeaders(() => indexer.fetch('/foo'), headers)

    await expect(result).resolves.toEqual(fakeResponse)
    expect(fakeFetch).toBeCalledTimes(1)

    const requestHeaders = Object.fromEntries(
      (fakeFetch.mock.calls[0][1]!.headers as Headers).entries(),
    )
    expect(requestHeaders).toEqual(headers)
  })
})
