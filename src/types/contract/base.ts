import type {
  Overrides as Overrides_,
  CallOverrides as CallOverrides_,
} from 'ethers'

/**
 * The result of a call to a transaction / get function.
 */
export interface Result<T, HasTxHash extends boolean = false> {
  data: T
  /** only available for write operation */
  transactionHash?: HasTxHash extends true ? string : never
}

export interface Overrides extends Overrides_ {
  from?: string
}

export interface CallOverrides extends CallOverrides_ {}
