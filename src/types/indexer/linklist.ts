import type { Address, Hash } from "viem";
import type { MetadataEntity } from "./metadata";

export interface LinklistEntity {
	linklistId: number;
	attached: boolean;
	fromCharacterId: number | null;
	linkType: string;
	uri: string | null;
	metadata?: MetadataEntity<"LINKLIST"> | null;
	operator: Address;
	owner: Address;
	fromAddress: Address;
	createdAt: string;
	updatedAt: string;
	transactionHash: Hash;
	blockNumber: number;
	logIndex: number;
	updatedTransactionHash: Hash;
	updatedBlockNumber: number;
	updatedLogIndex: number;
}
