/**
 * The result of a call to a transaction / get function.
 */
export type Result<T> = {
  data: T
  /* only available for transactions */
  transactionHash?: string
}

export type Profile = {
  profileId: string
  handle: string
  uri: string
  socialToken: string
  noteCount: number
}
