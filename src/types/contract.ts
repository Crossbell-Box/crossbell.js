import { NoteMetadata, CharacterMetadata } from './metadata'

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

export type Character = {
  /** The id of this character. */
  characterId: number
  /** The handle of this character. */
  handle: string
  /** The metadata URI of this character. */
  uri: string
  /** The metadata of this character. */
  metadata?: CharacterMetadata
  /** The social token of this character. */
  socialToken: string
  /** The count of notes this character posted. */
  noteCount: number
}

export type LinkItemType =
  | 'Character'
  | 'Address'
  | 'Note'
  | 'ERC721'
  | 'Linklist'
  | 'AnyUri'
// | 'CharacterLink'
// | 'AddressLink'
// | 'NoteLink'
// | 'ERC721Link'
// | 'ListLink'
// | 'AnyLink'

export type LinkItemCharacter = {
  characterId: number
}

export type LinkItemAddress = {
  address: string
}

export type LinkItemNote = {
  characterId: number
  noteId: number
}

export type LinkItemERC721 = {
  contractAddress: string
  tokenId: string
}

export type LinkItemLinklist = {
  linklistId: number
}

export type LinkItemAnyUri = {
  uri: string
}

export type LinkItem =
  | LinkItemCharacter
  | LinkItemAddress
  | LinkItemNote
  | LinkItemERC721
  | LinkItemLinklist
  | LinkItemAnyUri

export type Note<T extends LinkItem | undefined = undefined> = {
  /** The character id of the address who owns the note.  */
  characterId: number
  /** The id of this note. Each id is unique under one character. */
  noteId: number

  /** The content URI of this note. */
  contentUri: string
  /** The metadata content of this note. */
  metadata?: NoteMetadata

  /** The bytes32 representation of the link if there is one. */
  linkItemType: string
  /** The type of the link if there is one. */
  linkItemTypeString?: LinkItemType

  linkItem: T

  /**
   * The primary key (id) of the linking target. It's keccak256 encoded.
   * You may need to use `contract.getLinkingXXX(linkKey)` to get the target.
   **/
  linkKey: string
  /** The link module address of the note. */
  linkModule: string

  /** NFT contract address if this is a minted NFT note. */
  contractAddress: string
  /** The mint module address of the note */
  mintModule: string

  /** Whether or not this note has been deleted. */
  deleted: boolean
  /** Whether or not this note has been locked. I.e., not able to be edited. */
  locked: boolean
}

export type PostNoteOptions = {
  /** If locked, the note will be not able to be edited. */
  locked?: boolean
}
