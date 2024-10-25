import type { Address, Hash } from "viem";
import type { ListResponse, Numberish, TipEntity } from "../../types";
import type { BaseIndexer } from "./base";

export class TipIndexer {
	constructor(private base: BaseIndexer) {}

	/**
	 * This returns a list of tips.
	 *
	 * @category Tip
	 * @param characterId - The characterId of the feed owner.
	 * @param options - The options to send to the indexer.
	 * @returns The list of tips.
	 */
	getMany({
		characterId,
		toCharacterId,
		toNoteId,
		tokenAddress,
		includeZeroAmount,
		includeMetadata,
		limit,
		cursor,
	}: {
		/** The characterId of the tip sender. */
		characterId?: Numberish;
		/** The characterId of the tip receiver. */
		toCharacterId?: Numberish;
		/** The noteId of the tip receiver. */
		toNoteId?: Numberish;
		/** The token address of the token sent in tip. */
		tokenAddress?: Address;
		/** Whether to include tips with zero amount. */
		includeZeroAmount?: boolean;
		/** Whether to include character and note metadata */
		includeMetadata?: boolean;
		/** Limit the count of items returned. */
		limit?: Numberish;
		/** Used for pagination. */
		cursor?: string;
	} = {}) {
		const url = "/tips";

		return this.base.fetch<ListResponse<TipEntity>>(url, {
			params: {
				characterId,
				toCharacterId,
				toNoteId,
				tokenAddress,
				includeZeroAmount,
				includeMetadata,
				limit,
				cursor,
			},
		});
	}

	/**
	 * This returns a specific tip.
	 *
	 * @category Tip
	 * @param transactionHash - The transactionHash of the tip.
	 * @param logIndex - The logIndex of the tip.
	 * @returns The tip.
	 */
	get(transactionHash: Hash, logIndex: Numberish) {
		const url = `/tips/${transactionHash}/${logIndex}`;
		return this.base.fetch<TipEntity | null>(url);
	}
}
