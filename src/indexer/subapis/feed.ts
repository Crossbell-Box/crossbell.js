import type { Hash } from "viem";
import type {
	FeedEntity,
	FeedTypeKey,
	ListResponse,
	Numberish,
} from "../../types";
import type { BaseIndexer } from "./base";

export class FeedIndexer {
	constructor(private base: BaseIndexer) {}

	/**
	 * This returns a list of feeds.
	 *
	 * @category Feed
	 * @param characterId - The characterId of the feed owner.
	 * @param options - The options to send to the indexer.
	 * @returns The list of feeds.
	 */
	getManyByCharacter(
		characterId: Numberish,
		{
			type,
			limit,
			cursor,
		}: {
			/** The type of feed */
			type?: FeedTypeKey | FeedTypeKey[];
			/** Limit the count of items returned. */
			limit?: Numberish;
			/** Used for pagination. */
			cursor?: string;
		} = {},
	) {
		const url = `/characters/${characterId}/feed`;
		return this.base.fetch<ListResponse<FeedEntity>>(url, {
			params: {
				type,
				limit,
				cursor,
			},
		});
	}

	/**
	 * This returns a list of following's feeds.
	 *
	 * @category Feed
	 * @param characterId - The characterId of the feed owner.
	 * @param options - The options to send to the indexer.
	 * @returns The list of feeds.
	 */
	getManyByCharacterFollowing(
		characterId: Numberish,
		{
			type,
			limit,
			cursor,
		}: {
			/** The type of feed */
			type?: FeedTypeKey | FeedTypeKey[];
			/** Limit the count of items returned. */
			limit?: Numberish;
			/** Used for pagination. */
			cursor?: string;
		} = {},
	) {
		const url = `/characters/${characterId}/feed/follow`;
		return this.base.fetch<ListResponse<FeedEntity>>(url, {
			params: {
				type,
				limit,
				cursor,
			},
		});
	}

	/**
	 * This returns a specific feed.
	 *
	 * @category Feed
	 * @param transactionHash - The transactionHash of the feed.
	 * @param logIndex - The logIndex of the feed.
	 * @returns The feed.
	 */
	get(transactionHash: Hash, logIndex: Numberish) {
		const url = `/feed/${transactionHash}/${logIndex}`;
		return this.base.fetch<FeedEntity | null>(url);
	}
}
