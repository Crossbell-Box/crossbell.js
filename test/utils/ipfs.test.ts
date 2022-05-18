import { expect, describe, test } from 'vitest'
import { Ipfs } from '../../src/ipfs'

describe.concurrent('ipfs', () => {
  test.concurrent('uploadJson', async () => {
    const res = await Ipfs.uploadJson({
      type: 'profile',
      name: 'test',
    })

    expect(res.status).toBe('ok')
    expect(res.cid).toBeDefined()
    expect(res.url).toBeDefined()
    expect(res.web2url).toBeDefined()
  })
})
