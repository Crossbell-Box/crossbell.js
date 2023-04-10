export interface LinkItemMap {
  Character: LinkItemCharacter
  Address: LinkItemAddress
  Note: LinkItemNote
  ERC721: LinkItemERC721
  Linklist: LinkItemLinklist
  AnyUri: LinkItemAnyUri
  // | 'CharacterLink'
  // | 'AddressLink'
  // | 'NoteLink'
  // | 'ERC721Link'
  // | 'ListLink'
  // | 'AnyLink'
}

export type LinkItemType = keyof LinkItemMap
export type LinkItem = LinkItemMap[LinkItemType]

export interface LinkItemCharacter {
  characterId: bigint
}

export interface LinkItemAddress {
  address: string
}

export interface LinkItemNote {
  characterId: bigint
  noteId: bigint
}

export interface LinkItemERC721 {
  contractAddress: string
  tokenId: string
}

export interface LinkItemLinklist {
  linklistId: bigint
}

export interface LinkItemAnyUri {
  uri: string
}
