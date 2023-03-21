export function isAddressEqual(address1: string, address2: string) {
  if (!address1 || !address2) return false
  return address1.toLowerCase() === address2.toLowerCase()
}

export const NIL_ADDRESS = '0x0000000000000000000000000000000000000000'
