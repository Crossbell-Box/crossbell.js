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
