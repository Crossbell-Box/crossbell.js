import type {
	AchievementItem,
	AchievementSection,
	AchievementStatusKey,
	ListResponse,
	Numberish,
} from "../../types";
import type { BaseIndexer } from "./base";

export class AchievementIndexer {
	constructor(private base: BaseIndexer) {}

	/**
	 * This returns a list of achievements owned by a specific address.
	 * @category Achievement
	 * @param characterId - The id of the character.
	 * @param options - The options to send to the indexer.
	 * @returns The list of achievements.
	 */
	getMany(
		characterId: Numberish,
		{ status }: { status?: AchievementStatusKey[] } = {},
	) {
		const url = `/characters/${characterId}/achievements`;
		return this.base.fetch<ListResponse<AchievementSection> | null>(url, {
			params: { status },
		});
	}

	/**
	 * This asks the indexer to mint an achievement for a specific character.
	 * @category Achievement
	 * @param characterId - The id of the character.
	 * @param achievementId - The token id of the achievement.
	 * @returns The achievement minted.
	 */
	mint(characterId: Numberish, achievementId: Numberish) {
		const url = `/characters/${characterId}/achievements/${achievementId}`;
		return this.base.fetch<AchievementItem>(url, { method: "POST" });
	}
}
