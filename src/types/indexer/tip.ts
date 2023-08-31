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

export interface TipConfigEntity {
  tipConfigId: number
  characterId: number
  character?: CharacterEntity
  toCharacterId: number
  toCharacter?: CharacterEntity
  amount: number
  startTime: Date
  endTime: Date
  currentRound: number
  totalRound: number
  tokenAddress: string
  createdAt: Date
  updatedAt: Date
  tips: TipEntity[]
  transactionHash: string
  blockNumber: number
  logIndex: number
  updatedTransactionHash: string
  updatedBlockNumber: number
  updatedLogIndex: number
}
