import type { Address, Hash } from "viem";
import type { CharacterEntity } from "./character";
import type { LinklistEntity } from "./linklist";
import type { NoteEntity } from "./note";

export type LinkModuleTargetItemType =
	| "Address"
	| "Character"
	| "ERC721"
	| "Linklist"
	| "Note";

export interface LinkModuleEntity {
	targetItemType: LinkModuleTargetItemType;
	linkValue: string;
	contractAddress: Address;
	initData: string;
	returnData: string;
	toCharacterId: number | null;
	toCharacter?: CharacterEntity | null;
	toAddress: Address;
	toNoteId: number | null;
	toNote?: NoteEntity | null;
	toContractAddress: Address | null;
	toTokenId: number | null;
	toLinklistId: number | null;
	toLinklist?: LinklistEntity | null;
	operator: Address;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date | null;
	transactionHash: Hash;
	blockNumber: number;
	logIndex: number;
	updatedTransactionHash: Hash;
	updatedBlockNumber: number;
	updatedLogIndex: number;
}
