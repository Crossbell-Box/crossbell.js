import { BaseIndexer } from './base'
import queryString from 'query-string'
import type {
  ListResponse,
  AchievementSection,
  AchievementItem,
} from '../../types/indexer'
import { type BigNumberish } from 'ethers'

export class AchievementIndexer extends BaseIndexer {
  /**
   * This returns a list of achievements owned by a specific address.
   * @category Achievement
   * @param characterId - The id of the character.
   * @returns The list of achievements.
   */
  async getAchievement(
    characterId: BigNumberish,
    { minted }: { minted?: boolean } = {},
  ): Promise<ListResponse<AchievementSection> | null> {
    let url = `${this.endpoint}/characters/${characterId}/achievements?`

    url + queryString.stringify({ minted })

    const res = await fetch(url).then((res) => res.json())

    return res as ListResponse<AchievementSection>
  }

  /**
   * This asks the indexer to mint an achievement for a specific character.
   * @category Achievement
   * @param characterId - The id of the character.
   * @param achievementId - The token id of the achievement.
   * @returns The achievement minted.
   */
  async mintAchievement(
    characterId: BigNumberish,
    achievementId: BigNumberish,
  ): Promise<AchievementItem> | never {
    let url = `${this.endpoint}/characters/${characterId}/achievements/${achievementId}`

    const res = await fetch(url, { method: 'POST' }).then((res) => res.json())

    return res as AchievementItem
  }
}
