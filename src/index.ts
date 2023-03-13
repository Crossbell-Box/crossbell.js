import { Network } from './network'
import { Contract } from './contract'
import { Indexer } from './indexer'
import { Ipfs } from './ipfs'
import type { Abi as EntryAbi } from './contract/abis/entry/types'
import type { Abi as PeripheryAbi } from './contract/abis/periphery/types'
import type { Abi as CbtAbi } from './contract/abis/cbt/types'
import type { Abi as TipsAbi } from './contract/abis/tips/types'

export default { Network, Contract, Indexer, Ipfs }
export {
  Network,
  Contract,
  Indexer,
  Ipfs,
  EntryAbi,
  PeripheryAbi,
  CbtAbi,
  TipsAbi,
}
export * from './types'
export * as utils from './utils'

export * as EntryTypes from './contract/abis/entry/types/Abi'
export * as PeripheryTypes from './contract/abis/periphery/types/Abi'
export * as CbtTypes from './contract/abis/cbt/types/Abi'
export * as TipsTypes from './contract/abis/tips/types/Abi'
