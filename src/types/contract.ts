import { NoteMetadata, ProfileMetadata } from './metadata'

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

export type Profile = {
  /** The id of this profile. */
  profileId: string
  /** The handle of this profile. */
  handle: string
  /** The metadata URI of this profile. */
  uri: string
  /** The metadata of this profile. */
  metadata?: ProfileMetadata
  /** The social token of this profile. */
  socialToken: string
  /** The count of notes this profile posted. */
  noteCount: number
}

export type LinkItemType =
  | 'Profile'
  | 'Address'
  | 'Note'
  | 'ERC721'
  | 'Linklist'
  | 'AnyUri'
// | 'ProfileLink'
// | 'AddressLink'
// | 'NoteLink'
// | 'ERC721Link'
// | 'ListLink'
// | 'AnyLink'

export type Note = {
  /** The profile id of the address who owns the note.  */
  profileId: string
  /** The id of this note. Each id is unique under one profile. */
  noteId: string

  /** The content URI of this note. */
  contentUri: string
  /** The metadata content of this note. */
  metadata?: NoteMetadata

  /** The bytes32 representation of the link if there is one. */
  linkItemType: string
  /** The type of the link if there is one. */
  linkItemTypeString?: LinkItemType
  /**
   * The primary key (id) of the linking target. It's keccak256 encoded.
   * You may need to use `contract.getLinkingXXX(linkKey)` to get the target.
   **/
  linkKey: string
  /** The link module address of the note. */
  linkModule: string

  /** NFT contract address if this is a minted NFT note. */
  mintNFT: string
  /** The mint module address of the note */
  mintModule: string

  /** Whether or not this note has been deleted. */
  deleted: boolean
}
