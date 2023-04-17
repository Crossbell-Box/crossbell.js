import { type Address, type Hash } from 'viem'
import { type MetadataEntity } from './metadata'

export interface CharacterEntity {
  characterId: number
  handle: string
  primary: boolean
  uri: string | null
  metadata?: MetadataEntity<'CHARACTER'> | null
  socialToken: string | null
  operator: Address
  owner: Address
  fromAddress: Address
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  transactionHash: Hash
  blockNumber: number
  logIndex: number
  updatedTransactionHash: Hash
  updatedBlockNumber: number
  updatedLogIndex: number
}
