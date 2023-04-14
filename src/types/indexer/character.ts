import { Address } from 'abitype'
import { MetadataEntity } from './metadata'

export interface CharacterEntity {
  characterId: number
  handle: string
  primary: boolean
  uri: string | null
  metadata?: MetadataEntity<'CHARACTER'> | null
  socialToken: string | null
  operator: string
  owner: string
  fromAddress: Address
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  transactionHash: string
  blockNumber: number
  logIndex: number
  updatedTransactionHash: string
  updatedBlockNumber: number
  updatedLogIndex: number
}
