import { type Address } from 'viem'
import { type MaybeArray } from '../types/utils'
import { validateIsInSdn } from './sdn'

export const NIL_ADDRESS: Address = '0x0000000000000000000000000000000000000000'

export function validateAddress(address: MaybeArray<Address>) {
  if (Array.isArray(address)) {
    address.forEach((addr) => validateAddress(addr))
  } else {
    validateIsInSdn(address)
  }
}
