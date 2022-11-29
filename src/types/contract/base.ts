import type {
  Overrides as Overrides_,
  CallOverrides as CallOverrides_,
} from 'ethers'

/**
 * The result of a call to a transaction / get function.
 */
export type Result<T, HasTxHash extends boolean = false> = {
  data: T
} & (HasTxHash extends true
  ? {
      /** only available for write operation */
      transactionHash: string
    }
  : {})

export type Overrides = Overrides_ & {
  from?: string | undefined
}

export type CallOverrides = CallOverrides_
