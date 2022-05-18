import { expect, describe, test } from 'vitest'
import { parseCsbUri } from '../../src/utils/csb_uri'

describe.concurrent('csb uri', () => {
  test.concurrent('parseCsbUri', async () => {
    // error cases

    expect(() => parseCsbUri('https://random')).toThrow()

    // success cases

    let res = parseCsbUri('csb://account:0x0@ethereum')
    expect(res.scheme).toBe('csb://')
    expect(res.scope).toBe('account')
    expect(res.identity).toBe('0x0')
    expect(res.platform).toBe('ethereum')

    res = parseCsbUri('csb://asset:0x123-4@polygon')
    expect(res.scheme).toBe('csb://')
    expect(res.scope).toBe('asset')
    expect(res.identity).toBe('0x123-4')
    expect(res.network).toBe('polygon')
    expect(res.contract_address).toBe('0x123')
    expect(res.token_id).toBe('4')
  })
})
