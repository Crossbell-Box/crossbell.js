import { MetadataEntity } from './metadata'

export interface LinklistEntity {
  linklistId: number
  attached: boolean
  fromCharacterId: number | null
  linkType: string
  uri: string | null
  metadata?: MetadataEntity<'LINKLIST'> | null
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
