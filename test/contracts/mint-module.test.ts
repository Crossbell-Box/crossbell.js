import { describe, expect, test } from 'vitest'
import {
  decodeModuleInitData,
  encodeModuleInitData,
  getModules,
} from '../../src'

describe('mind-module', () => {
  const input = [
    [
      '0x1234567890123456789012345678901234567890',
      '0xAbc123def456aBc123def456aBc123DEf456ABc1',
    ],
    1n,
  ]
  const output =
    '0x0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000001234567890123456789012345678901234567890000000000000000000000000abc123def456abc123def456abc123def456abc1'

  test('encodeModuleInitData', async () => {
    const modules = await getModules()
    const result = await encodeModuleInitData(modules[0].address, input)
    expect(result).toBe(output)
  })

  test('decodeModuleInitData', async () => {
    const modules = await getModules()
    const result = await decodeModuleInitData(modules[0].address, output)
    expect(result).toStrictEqual(input)
  })
})
