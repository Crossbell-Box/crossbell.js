import { CharacterEntity } from './character'
import { NoteEntity } from './note'

export interface TipEntity {
  characterId: number
  character?: CharacterEntity
  toCharacterId: number
  toCharacter?: CharacterEntity
  toNoteId: number | null
  toNote?: NoteEntity | null
  amount: string
  tokenAddress: string
  createdAt: Date
  transactionHash: string
  blockNumber: number
  logIndex: number
}
