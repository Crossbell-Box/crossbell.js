import type { Address, Hex } from "viem";
import { Contract } from "../src";

export const mockUser = {
	address: process.env.VITE_MOCK_USER_ADDRESS as Address,
	privateKey: process.env.VITE_MOCK_USER_PRIVATE_KEY as Hex,
	email: process.env.VITE_MOCK_USER_EMAIL as string,
	password: process.env.VITE_MOCK_USER_PASSWORD as string,
};

export const randomHandle = genRandomHandle();
export const randomHandle2 = genRandomHandle();
export const metadataUri =
	"ipfs://QmTMD6sLA7M4iegKDhbdMPBZ4HLi5fjW27w2J16gqc5Cb7/1.json";
export const metadataUri2 =
	"ipfs://QmTMD6sLA7M4iegKDhbdMPBZ4HLi5fjW27w2J16gqc5Cb7/2.json";

export function genRandomHandle(): string {
	const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
	let handle = "";
	for (let i = 0; i < 10; i++) {
		handle += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return `a-random-handle-${handle}`;
}

export const NIL_ADDRESS = "0x0000000000000000000000000000000000000000";

export const testContract = new Contract(mockUser.privateKey, {
	chain: "testnet",
});
