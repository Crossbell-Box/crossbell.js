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
