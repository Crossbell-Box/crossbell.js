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

export interface LinkItemCharacter {
  characterId: number
}

export interface LinkItemAddress {
  address: string
}

export interface LinkItemNote {
  characterId: number
  noteId: number
}

export interface LinkItemERC721 {
  contractAddress: string
  tokenId: string
}

export interface LinkItemLinklist {
  linklistId: number
}

export interface LinkItemAnyUri {
  uri: string
}

export type LinkItem =
  | LinkItemCharacter
  | LinkItemAddress
  | LinkItemNote
  | LinkItemERC721
  | LinkItemLinklist
  | LinkItemAnyUri
