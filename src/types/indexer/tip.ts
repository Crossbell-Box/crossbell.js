import { type Address } from 'viem'
import { type CharacterEntity } from './character'
import { type NoteEntity } from './note'

export interface TipEntity {
  characterId: number
  character?: CharacterEntity
  toCharacterId: number
  toCharacter?: CharacterEntity
  toNoteId: number | null
  toNote?: NoteEntity | null
  amount: string
  tokenAddress: Address
  createdAt: Date
  transactionHash: string
  blockNumber: number
  logIndex: number
}
