type AchievementInfo = {
  tokenId: number
  name: FunctionStringCallback
  uri: string

  description: string
  media: string
  attributes: [{ trait_type: string; value: string }]

  targetValue?: number
  unit: string
}

export type AchievementItem = {
  tokenId: number
  characterId: number
  name: string
  status: 'INACTIVE' | 'MINTABLE' | 'MINTED'
  tokenNumber: number
  currentValue: number
  createdAt: string
  updatedAt: string
  mintedAt: string | null
  transactionHash: string | null
  info: AchievementInfo
  stat: {
    mintedCount: number
  }
}

type AchievementItemGroup = {
  info: {
    name: string
    title: string
  }
  items: AchievementItem[]
}

export type AchievementSection = {
  info: {
    name: string
    title: string
  }
  groups: AchievementItemGroup[]
}
