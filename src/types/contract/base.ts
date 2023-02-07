import type {
  Overrides as Overrides_,
  CallOverrides as CallOverrides_,
} from 'ethers'

/**
 * The result of a call to a transaction / get function.
 */
export type Result<T, HasTxHash extends boolean = false> = {
  data: T
} & (HasTxHash extends true ? { transactionHash: string } : {})

export interface Overrides extends Overrides_ {
  from?: string
}

export interface CallOverrides extends CallOverrides_ {}
