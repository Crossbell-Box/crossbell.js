import { describe, expect, test } from 'vitest'
import { Contract } from '../../src'
import { mockUser } from '../mock'

const contract = new Contract(mockUser.privateKey)

describe('csb', () => {
  test('getBalance', async () => {
    const { data: balance } = await contract.csb.getBalance(mockUser.address)
    expect(balance > 0n).toBe(true)
  })

  test('transfer', async () => {
    const res = await contract.csb.transfer(mockUser.address, 0)
    expect(res.transactionHash).toBeDefined()
  })
})
