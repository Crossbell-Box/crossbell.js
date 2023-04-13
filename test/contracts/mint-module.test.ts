import { expect, describe, test } from 'vitest'
import { encodeModuleInitData, decodeModuleInitData } from '../../src'

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
    const result = await encodeModuleInitData(
      '0x328610484ba1faae0fcdee44990d199cd84c8608',
      input,
    )
    expect(result).toBe(output)
  })

  test('decodeModuleInitData', async () => {
    const result = await decodeModuleInitData(
      '0x328610484ba1faae0fcdee44990d199cd84c8608',
      output,
    )
    expect(result).toStrictEqual(input)
  })
})
