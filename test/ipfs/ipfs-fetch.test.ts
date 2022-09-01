import { expect, describe, it } from 'vitest'

import {
  IPFS_URL,
  ERROR_IPFS_GATEWAY,
  SUCCESS_A_IPFS_GATEWAY,
  SUCCESS_B_IPFS_GATEWAY,
  TIMEOUT_IPFS_GATEWAY,
} from '../mocks/handlers'

import { ipfsFetch, IpfsFetchError } from '../../src/ipfs/ipfs-fetch'

describe.concurrent('ipfs-fetch', () => {
  it('should return first success response', async () => {
    const res = await ipfsFetch(IPFS_URL, {
      gateways: [
        ERROR_IPFS_GATEWAY,
        TIMEOUT_IPFS_GATEWAY,
        SUCCESS_B_IPFS_GATEWAY,
        SUCCESS_A_IPFS_GATEWAY,
      ],
    })

    expect(await res.json()).toEqual({ name: 'A' })
    expect(res.status).toBe(200)
  })

  it('should throw timeout error if no success request', async () => {
    try {
      await ipfsFetch(IPFS_URL, {
        gateways: [ERROR_IPFS_GATEWAY],
        timeout: 1000,
      })
    } catch (e) {
      expect(e).instanceof(Error)
      expect((e as Error).message).toBe(IpfsFetchError.timeout)
    }
  })

  it('should throw timeout error if request timeout', async () => {
    try {
      await ipfsFetch(IPFS_URL, {
        gateways: [TIMEOUT_IPFS_GATEWAY],
        timeout: 1000,
      })
    } catch (e) {
      expect(e).instanceof(Error)
      expect((e as Error).message).toBe(IpfsFetchError.timeout)
    }
  })
})
