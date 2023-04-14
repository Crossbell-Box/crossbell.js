import { createSearchParamsString } from '../../utils'
import {
  type AchievementItem,
  type AchievementSection,
  type AchievementStatusKey,
  type ListResponse,
  type Numberish,
} from '../../types'
import { BaseIndexer } from './base'

export class AchievementIndexer extends BaseIndexer {
  /**
   * This returns a list of achievements owned by a specific address.
   * @category Achievement
   * @param characterId - The id of the character.
   * @param options - The options to send to the indexer.
   * @returns The list of achievements.
   */
  async getAchievements(
    characterId: Numberish,
    { status }: { status?: AchievementStatusKey[] } = {},
  ): Promise<ListResponse<AchievementSection> | null> {
    let url = `${this.endpoint}/characters/${characterId}/achievements?`

    url += createSearchParamsString({ status })

    const res = await this.fetch(url).then((res) => res.json())

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
    characterId: Numberish,
    achievementId: Numberish,
  ): Promise<AchievementItem> | never {
    const url = `${this.endpoint}/characters/${characterId}/achievements/${achievementId}`

    const res = await this.fetch(url, { method: 'POST' }).then((res) =>
      res.json(),
    )

    return res as AchievementItem
  }
}
