import { CharacterEntity } from './character'
import { NoteEntity } from './note'

export interface MintedNoteEntity {
  noteCharacterId: number
  noteCharacter?: CharacterEntity
  noteId: number
  note?: NoteEntity | null
  contractAddress: string
  tokenId: number
  operator: string
  owner: string
  fromAddress: string
  createdAt: string
  updatedAt: string
  transactionHash: string
  blockNumber: number
  logIndex: number
  updatedTransactionHash: string
  updatedBlockNumber: number
  updatedLogIndex: number
}
