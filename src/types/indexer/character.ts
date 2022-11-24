import { MetadataEntity } from './metadata'

export type CharacterEntity = {
  characterId: number
  handle: string
  primary: boolean
  uri: string | null
  metadata?: MetadataEntity<'CHARACTER'> | null
  socialToken: string | null
  operator: string
  owner: string
  operators: string[]
  fromAddress: string
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
