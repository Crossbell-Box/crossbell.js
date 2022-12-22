export enum CharacterOperatorPermission {
  SET_HANDLE = 'SET_HANDLE',
  SET_SOCIAL_TOKEN = 'SET_SOCIAL_TOKEN',
  GRANT_OPERATOR_PERMISSIONS = 'GRANT_OPERATOR_PERMISSIONS',
  SET_CHARACTER_URI = 'SET_CHARACTER_URI',
  SET_LINKLIST_URI = 'SET_LINKLIST_URI',
  LINK_CHARACTER = 'LINK_CHARACTER',
  UNLINK_CHARACTER = 'UNLINK_CHARACTER',
  CREATE_THEN_LINK_CHARACTER = 'CREATE_THEN_LINK_CHARACTER',
  LINK_NOTE = 'LINK_NOTE',
  UNLINK_NOTE = 'UNLINK_NOTE',
  LINK_ERC721 = 'LINK_ERC721',
  UNLINK_ERC721 = 'UNLINK_ERC721',
  LINK_ADDRESS = 'LINK_ADDRESS',
  UNLINK_ADDRESS = 'UNLINK_ADDRESS',
  LINK_ANY_URI = 'LINK_ANY_URI',
  UNLINK_ANY_URI = 'UNLINK_ANY_URI',
  LINK_LINKLIST = 'LINK_LINKLIST',
  UNLINK_LINKLIST = 'UNLINK_LINKLIST',
  SET_LINK_MODULE_FOR_CHARACTER = 'SET_LINK_MODULE_FOR_CHARACTER',
  SET_LINK_MODULE_FOR_NOTE = 'SET_LINK_MODULE_FOR_NOTE',
  SET_LINK_MODULE_FOR_LINKLIST = 'SET_LINK_MODULE_FOR_LINKLIST',
  SET_MINT_MODULE_FOR_NOTE = 'SET_MINT_MODULE_FOR_NOTE',
  SET_NOTE_URI = 'SET_NOTE_URI',
  LOCK_NOTE = 'LOCK_NOTE',
  DELETE_NOTE = 'DELETE_NOTE',
  POST_NOTE_FOR_CHARACTER = 'POST_NOTE_FOR_CHARACTER',
  POST_NOTE_FOR_ADDRESS = 'POST_NOTE_FOR_ADDRESS',
  POST_NOTE_FOR_LINKLIST = 'POST_NOTE_FOR_LINKLIST',
  POST_NOTE_FOR_NOTE = 'POST_NOTE_FOR_NOTE',
  POST_NOTE_FOR_ERC721 = 'POST_NOTE_FOR_ERC721',
  POST_NOTE_FOR_ANY_URI = 'POST_NOTE_FOR_ANY_URI',
  POST_NOTE = 'POST_NOTE',
}

export type CharacterPermissionKey = keyof typeof CharacterOperatorPermission

export type CharacterOperatorEntity = {
  characterId: number
  operator: string
  permissions: CharacterPermissionKey[]
  createdAt: Date
  updatedAt: Date
  transactionHash: string
  blockNumber: number
  logIndex: number
  updatedTransactionHash: string
  updatedBlockNumber: number
  updatedLogIndex: number
}

export type NoteOperatorEntity = {
  characterId: number
  noteId: number
  operator: string
  createdAt: Date
  updatedAt: Date
  transactionHash: string
  blockNumber: number
  logIndex: number
  updatedTransactionHash: string
  updatedBlockNumber: number
  updatedLogIndex: number
}
