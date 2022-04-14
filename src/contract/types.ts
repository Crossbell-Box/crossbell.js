/**
 * The result of a call to a transaction / get function.
 */
type Result<T> = {
  data: T
  /* only available for transactions */
  transactionHash?: string
}

type Profile = {
  handle: string
  metadataUri: string
  socialToken: string
  noteCount: number
}
