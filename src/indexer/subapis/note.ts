import type { Address } from "viem";
import type {
	LinkItemType,
	ListResponse,
	NoteEntity,
	NoteMetadata,
	Numberish,
} from "../../types";
import type { BaseIndexer } from "./base";

export type NoteQueryOptions = {
	/** The owner(s) of notes */
	characterId?: Numberish | Numberish[];
	/** Excluded owner(s) of notes. This has higher priority than `characterId` */
	excludeCharacterId?: Numberish | Numberish[];
	/** The link item type to filter by. e.g. 'Character' */
	linkItemType?: LinkItemType;
	/** The toCharacterId to filter by. */
	toCharacterId?: Numberish;
	/** The toAddress to filter by. */
	toAddress?: Address;
	/** The toNoteId to filter by. */
	toNoteId?: Numberish;
	/** The toContractAddress to filter by. */
	toContractAddress?: Address;
	/** The toTokenId to filter by. */
	toTokenId?: Numberish;
	/** The toLinklistId to filter by. */
	toLinklistId?: Numberish;
	/** The toUri to filter by. */
	toUri?: string;
	/** Only returns locked notes or not */
	locked?: boolean;
	/** Also returns deleted notes or not */
	includeDeleted?: boolean;
	/** The `metadata.content.tags` to filter by. */
	tags?: string | string[];
	/** The `metadata.content.sources` to filter by. */
	sources?: string | string[];
	/** The `metadata.content.external_urls` to filter by. */
	externalUrls?: string | string[];
	/** The `metadata.content.variant` to filter by. */
	variant?: NoteMetadata["variant"];
	/** Limit the count of items returned. */
	limit?: Numberish;
	/** Used for pagination. */
	cursor?: string;
	/** Whether to include notes whose metadata content are empty even though the `tags`, `sources` or `external_urls` fields are specified. */
	includeEmptyMetadata?: boolean;
	/** Whether to include the character data in the response. */
	includeCharacter?: boolean;
	/** Whether to include the head character data in the response. */
	includeHeadCharacter?: boolean;
	/** Whether to include the head note data in the response. */
	includeHeadNote?: boolean;
	/** Whether to include nested notes */
	includeNestedNotes?: boolean;
	/** How many levels of nested notes to include */
	nestedNotesDepth?: 1 | 2 | 3;
	/** How many nested notes to include per note */
	nestedNotesLimit?: Numberish;
	/** The orderBy of the returned list. */
	orderBy?: "createdAt" | "updatedAt" | "publishedAt" | "viewCount";
	/**
	 * The order of the returned list.
	 * @default 'desc'
	 **/
	order?: "asc" | "desc";
};

export class NoteIndexer {
	constructor(private base: BaseIndexer) {}

	/**
	 * This returns a list of notes.
	 *
	 * @category Note
	 * @param params - The options of note query.
	 * @returns The list of notes.
	 */
	getMany(params: NoteQueryOptions = {}) {
		const url = "/notes";
		return this.base.fetch<
			ListResponse<NoteEntity & { fromNotes: ListResponse<NoteEntity> }>
		>(url, { params });
	}

	/**
	 * This returns a list of notes of a list of characters followed by a character.
	 *
	 * @category Note
	 * @param characterId - The characterId.
	 * @param params - The options of note query.
	 * @returns
	 */
	getManyOfCharacterFollowing(
		characterId: Numberish,
		params: Omit<NoteQueryOptions, "characterId"> = {},
	) {
		const url = `/characters/${characterId}/notes/following`;
		return this.base.fetch<
			ListResponse<NoteEntity & { fromNotes: ListResponse<NoteEntity> }>
		>(url, { params });
	}

	/**
	 * This returns a specific note.
	 *
	 * @category Note
	 * @param characterId - The characterId of the notes owner.
	 * @param noteId - The noteId of the note to get.
	 * @returns The note.
	 */
	get(characterId: Numberish, noteId: Numberish) {
		const url = `/characters/${characterId}/notes/${noteId}`;
		return this.base.fetch<NoteEntity | null>(url);
	}

	/**
	 * This returns all distinct tags of notes owned by a character.
	 *
	 * @category Note
	 * @param characterId - The characterId of the notes owner.
	 * @param options - The options of note query.
	 * @returns The list of tags.
	 */
	getDistinctTagsOfCharacter(
		characterId: Numberish,
		{
			sources,
		}: {
			/** The `metadata.content.sources` to filter by. */
			sources?: string | string[];
		} = {},
	) {
		const url = `/characters/${characterId}/notes/tags`;
		return this.base.fetch<ListResponse<string>>(url, {
			params: {
				sources,
			},
		});
	}

	/**
	 * This returns all distinct tags of notes owned by a character.
	 *
	 * @category Note
	 * @param characterId - The characterId of the notes owner.
	 * @param options - The options of note query.
	 * @returns The list of tags.
	 */
	getDistinctSourcesOfCharacter(
		characterId: Numberish,
		{
			tags,
		}: {
			/** The `metadata.content.tags` to filter by. */
			tags?: string | string[];
		} = {},
	) {
		const url = `/characters/${characterId}/notes/sources`;
		return this.base.fetch<ListResponse<string>>(url, {
			params: {
				tags,
			},
		});
	}
}
