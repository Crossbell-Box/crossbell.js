import { type Hash } from 'viem'

export interface AchievementInfo {
  tokenId: number
  name: FunctionStringCallback
  uri: string

  description: string
  media: string
  attributes: [{ trait_type: string; value: string }]

  targetValue?: number
  unit: string
}

export enum AchievementStatus {
  INACTIVE = 'INACTIVE',
  MINTABLE = 'MINTABLE',
  MINTED = 'MINTED',
}

export type AchievementStatusKey = keyof typeof AchievementStatus

export interface AchievementItem {
  tokenId: number
  characterId: number
  name: string
  status: AchievementStatusKey
  tokenNumber: number
  currentValue: number
  createdAt: string
  updatedAt: string
  mintedAt: string | null
  transactionHash: Hash | null
  info: AchievementInfo
  stat: {
    mintedCount: number
  }
}

export interface AchievementItemGroup {
  info: {
    name: string
    title: string
  }
  items: AchievementItem[]
}

export interface AchievementSection {
  info: {
    name: string
    title: string
  }
  groups: AchievementItemGroup[]
}
