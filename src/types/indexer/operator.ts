export type CharacterOperatorPermission =
  | 'SET_HANDLE'
  | 'SET_SOCIAL_TOKEN'
  | 'GRANT_OPERATOR_PERMISSIONS'
  | 'SET_CHARACTER_URI'
  | 'SET_LINK_LIST_URI'
  | 'LINK_CHARACTER'
  | 'UNLINK_CHARACTER'
  | 'CREATE_THEN_LINK_CHARACTER'
  | 'LINK_NOTE'
  | 'UNLINK_NOTE'
  | 'LINK_ERC721'
  | 'UNLINK_ERC721'
  | 'LINK_ADDRESS'
  | 'UNLINK_ADDRESS'
  | 'LINK_ANY_URI'
  | 'UNLINK_ANY_URI'
  | 'LINK_LINK_LIST'
  | 'UNLINK_LINK_LIST'
  | 'SET_LINK_MODULE_FOR_CHARACTER'
  | 'SET_LINK_MODULE_FOR_NOTE'
  | 'SET_LINK_MODULE_FOR_LINK_LIST'
  | 'SET_MINT_MODULE_FOR_NOTE'
  | 'SET_NOTE_URI'
  | 'LOCK_NOTE'
  | 'DELETE_NOTE'
  | 'POST_NOTE_FOR_CHARACTER'
  | 'POST_NOTE_FOR_ADDRESS'
  | 'POST_NOTE_FOR_LINK_LIST'
  | 'POST_NOTE_FOR_NOTE'
  | 'POST_NOTE_FOR_ERC721'
  | 'POST_NOTE_FOR_ANY_URI'
  | 'POST_NOTE'

export type CharacterOperatorEntity = {
  characterId: number
  operator: string
  permissions: CharacterOperatorPermission[]
  createdAt: Date
  updatedAt: Date
  transactionHash: string
  blockNumber: number
  logIndex: number
  updatedTransactionHash: string
  updatedBlockNumber: number
  updatedLogIndex: number
}

export type NoteOperatorPermission =
  | 'SET_LINK_MODULE_FOR_NOTE'
  | 'SET_MINT_MODULE_FOR_NOTE'
  | 'SET_NOTE_URI'
  | 'LOCK_NOTE'
  | 'DELETE_NOTE'

export type NoteOperatorEntity = {
  characterId: number
  noteId: number
  operator: string
  permissions: NoteOperatorPermission[]
  createdAt: Date
  updatedAt: Date
  transactionHash: string
  blockNumber: number
  logIndex: number
  updatedTransactionHash: string
  updatedBlockNumber: number
  updatedLogIndex: number
}
