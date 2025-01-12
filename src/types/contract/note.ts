import type { Address } from "viem";
import type { NoteMetadata } from "../metadata";
import type { Numberish } from "../utils";
import type { LinkItem, LinkItemType } from "./link";
import type { MintOrLinkModuleConfig } from "./module";

export interface Note<T extends LinkItem | undefined = undefined> {
	/** The character id of the address who owns the note.  */
	characterId: bigint;
	/** The id of this note. Each id is unique under one character. */
	noteId: bigint;

	/** The content URI of this note. */
	contentUri: string;
	/** The metadata content of this note. */
	metadata?: NoteMetadata;

	/** The bytes32 representation of the link if there is one. */
	linkItemType: string;
	/** The type of the link if there is one. */
	linkItemTypeString?: LinkItemType;

	linkItem: T;

	/**
	 * The primary key (id) of the linking target. It's keccak256 encoded.
	 * You may need to use `contract.getLinkingXXX(linkKey)` to get the target.
	 **/
	linkKey: string;
	/** The link module address of the note. */
	linkModule: string;

	/** NFT contract address if this is a minted NFT note. */
	contractAddress: Address;
	/** The mint module address of the note */
	mintModule: string;

	/** Whether or not this note has been deleted. */
	deleted: boolean;
	/** Whether or not this note has been locked. I.e., not able to be edited. */
	locked: boolean;
}

export interface PostNoteOptions {
	/** If locked, the note will be not able to be edited. */
	locked?: boolean;
	/** The mint module */
	mintModule?: MintOrLinkModuleConfig;
	/** The link module */
	linkModule?: MintOrLinkModuleConfig;
	/** The character ID of the owner who post this note. Must be your own character, otherwise it will be rejected. */
	characterId: Numberish;
	/** The metadata or URI of the content you want to post. */
	metadataOrUri: NoteMetadata | string;
}
