import { type Address, type Hash } from 'viem'
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
  fee: string | null
  feeReceiverAddress: Address | null
  tokenAddress: Address
  createdAt: Date
  transactionHash: Hash
  blockNumber: number
  logIndex: number
}
