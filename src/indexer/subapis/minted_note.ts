import type { Address } from "viem";
import type {
	ListResponse,
	MintedNoteEntity,
	NoteMetadata,
	Numberish,
} from "../../types";
import type { BaseIndexer } from "./base";

export class MintedNoteIndexer {
	constructor(private base: BaseIndexer) {}

	/**
	 * This returns a list of minted notes.
	 *
	 * @category MintedNote
	 * @param address - The owner of the minted notes.
	 * @param options - The options to send to the indexer.
	 * @returns The list of minted notes.
	 */
	getManyOfAddress(
		address: Address,
		{
			noteCharacterId,
			noteId,
			variant,
			limit,
			cursor,
			order,
		}: {
			/** The character ID of the note */
			noteCharacterId?: Numberish;
			/** THe note id */
			noteId?: Numberish;
			/** The `metadata.content.variant` to filter by. */
			variant?: NoteMetadata["variant"];
			/** Limit the count of items returned. */
			limit?: Numberish;
			/** Used for pagination. */
			cursor?: string;
			/** The order to sort by. */
			order?: "asc" | "desc";
		} = {},
	) {
		const url = `/addresses/${address}/minted/notes`;
		return this.base.fetch<ListResponse<MintedNoteEntity>>(url, {
			params: {
				noteCharacterId,
				noteId,
				variant,
				limit,
				cursor,
				order,
			},
		});
	}

	/**
	 * This returns a list of minted notes.
	 *
	 * @category MintedNote
	 * @param characterId - The characterId of the note minted.
	 * @param noteId - The noteId of the note minted.
	 * @param options - The options to send to the indexer.
	 * @returns The list of minted notes.
	 */
	getManyOfNote(
		characterId: Numberish,
		noteId: Numberish,
		{
			owner,
			limit,
			cursor,
			order,
		}: {
			/** The address of the owner */
			owner?: Address;
			/** Limit the count of items returned. */
			limit?: Numberish;
			/** Used for pagination. */
			cursor?: string;
			/** The order to sort by. */
			order?: "asc" | "desc";
		} = {},
	) {
		const url = `/notes/${characterId}/${noteId}/minted`;
		return this.base.fetch<ListResponse<MintedNoteEntity>>(url, {
			params: {
				owner,
				limit,
				cursor,
				order,
			},
		});
	}

	/**
	 * This returns a specific minted note.
	 *
	 * @category MintedNote
	 * @param contractAddress - The contractAddress of the minted note.
	 * @param tokenId - The tokenId of the minted note.
	 * @returns The minted note.
	 */
	get(contractAddress: Address, tokenId: Numberish) {
		const url = `/minted/notes/${contractAddress}/${tokenId}`;
		return this.base.fetch<MintedNoteEntity | null>(url);
	}
}
