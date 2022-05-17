export type LinkFromToType = 'profile' | 'erc721' | 'note' | 'any'

export type LinkFromToDetails = ProfileDetail | undefined

export type ListResponse<T> = {
  updated_at: string
  total: number
  list: T[]
}

export type ProfileDetail = {
  token_id: string
  handle: string
  primary: boolean
  owner: string
  creator: string
  block_number: string
  transaction_hash: string
  metadata: {
    name?: string
    bio?: string
    avatars?: string[]
    banners?: string[]
    [key: string]: any
  } | null
  created_at: string
  updated_at: string
}

export type Linklist = {
  token_id: string
  creator: string
  profile_id: string
  type: string
  attached: boolean
  owner: string
  block_number: string
  transaction_hash: string
  metadata: object | null // TODO: next version
  created_at: string
}

export type Link<
  TFromDetail extends LinkFromToDetails = LinkFromToDetails,
  TToDetail extends LinkFromToDetails = LinkFromToDetails,
> = {
  link_list_id: string
  /** e.g. 'follow' */
  link_type: string
  /** token id of from (profile) */
  from: string
  /** e.g. 'profile' */
  from_type: LinkFromToType
  /** token id of to target */
  to: string
  /** e.g. 'profile' */
  to_type: LinkFromToType
  /** the detail of the subject (from) */
  from_detail: TFromDetail
  /** the detail of the target (to) */
  to_detail: TToDetail
  operator: string
  block_number: string
  transaction_hash: string
  created_at: string
  updated_at: string
}

export type GetLinkingItemsOptions = {
  /** E.g. ['follow'] */
  linkTypes?: string | string[]
  /** E.g. ['profile'] */
  fromTypes?: LinkFromToType | LinkFromToType[]
  /** E.g. ['profile'] */
  toTypes?: LinkFromToType | LinkFromToType[]
  /** Restrict what from (token_id) to fetch. */
  from?: string | string[]
  /** Restrict what to (token_id) to fetch. */
  to?: string | string[]
  /** Limit the count of items returned. */
  limit?: number
  /** Only returns the links in an attached linklist; true by default. */
  attached?: boolean
}
