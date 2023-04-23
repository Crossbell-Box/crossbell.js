import { describe, expect, it } from 'vitest'
import { Contract } from '../../src'
import { mockUser } from '../mock'

const contract = new Contract(mockUser.privateKey)

describe('revision', () => {
  it.concurrent('should return the latest revision', async () => {
    const { data: latest } = await contract.revision.getLatest()
    expect(latest > 0n).toBe(true)

    const { data: current } = contract.revision.getCurrent()
    expect(current).toBe(latest)
  })

  it.concurrent('check', async () => {
    const res = await contract.revision.check()
    expect(res.data.currentRevision > 0n).toBe(true)
    expect(res.data.isUpToDate).is.a('boolean')
    expect(res.data.latestRevision > 0n).toBe(true)
  })
})
