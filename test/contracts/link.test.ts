import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { describe, expect, test } from "vitest";

import { genRandomHandle, metadataUri, mockUser, testContract } from "../mock";

describe("link and check", () => {
	// create two characters first
	let characterId1: bigint | null = null;
	let characterId2: bigint | null = null;
	test("create two characters to link with", async () => {
		characterId1 = await testContract.character
			.create({
				owner: mockUser.address,
				handle: genRandomHandle(),
				metadataOrUri: metadataUri,
			})
			.then(({ data }) => data);
		characterId2 = await testContract.character
			.create({
				owner: mockUser.address,
				handle: genRandomHandle(),
				metadataOrUri: metadataUri,
			})
			.then(({ data }) => data);

		expect(characterId1).not.toBeNull();
		expect(characterId2).not.toBeNull();
	});

	const linkType = "follow";
	let linklistId: bigint | null = null;
	test("linkCharacter", async () => {
		if (!characterId1 || !characterId2) throw new Error("characterId is null");
		const result = await testContract.link.linkCharacter({
			fromCharacterId: characterId1,
			toCharacterId: characterId2,
			linkType,
		});
		linklistId = result.data;
		expect(linklistId).not.toBeNull();

		const linklist = await testContract.link.getLinklistIdByTransaction({
			hash: result.transactionHash,
		});
		expect(linklist.data).toBe(linklistId);
	});

	test("linkCharactersInBatch", async () => {
		if (!characterId1 || !characterId2) throw new Error("characterId is null");
		const result = await testContract.link.linkCharactersInBatch({
			fromCharacterId: characterId1,
			toCharacterIds: [characterId2],
			toAddresses: [],
			linkType,
		});

		expect(result.data).toBe(linklistId);
	});

	test("getLinkingCharacterIds", async () => {
		if (!characterId1 || !characterId2) throw new Error("characterId is null");
		const { data } = await testContract.link.getLinkingCharacterIds({
			fromCharacterId: characterId1,
			linkType,
		});
		expect(data).toContain(characterId2);
	});

	test("unlinkCharacter and check", async () => {
		if (!characterId1 || !characterId2) throw new Error("characterId is null");
		await testContract.link
			.unlinkCharacter({
				fromCharacterId: characterId1,
				toCharacterId: characterId2,
				linkType,
			})
			.then(({ data }) => data);

		const { data } = await testContract.link.getLinkingCharacterIds({
			fromCharacterId: characterId1,
			linkType,
		});
		expect(data).not.toContain(characterId2);
	});

	test("createThenLinkCharacter and check", async () => {
		if (!characterId1) throw new Error("characterId is null");
		const randomAddress = privateKeyToAccount(generatePrivateKey()).address;

		const result = await testContract.link.createThenLinkCharacter({
			fromCharacterId: characterId1,
			toAddress: randomAddress,
			linkType,
		});

		expect(result.data.toCharacterId).not.toBeNull();
		expect(linklistId).not.toBeNull();

		const { data } = await testContract.link.getLinkingCharacterIds({
			fromCharacterId: characterId1,
			linkType,
		});
		expect(data).toContain(result.data.toCharacterId);

		const {
			data: { handle },
		} = await testContract.character.getByHandle({ handle: randomAddress });
		expect(handle).toBe(randomAddress.toLowerCase());

		// should also able to get character by transaction
		const { data: character } = await testContract.character.getByTransaction({
			txHash: result.transactionHash,
		});
		expect(character.characterId).toBe(result.data.toCharacterId);
	});

	// link note
	test("create a note and link it", async () => {
		if (!characterId1) throw new Error("characterId is null");
		const note = await testContract.note.post({
			characterId: characterId1,
			metadataOrUri: {
				content: "test",
			},
		});

		// like this note
		const result1 = await testContract.link.linkNote({
			fromCharacterId: characterId1,
			toCharacterId: characterId1,
			toNoteId: note.data.noteId,
			linkType: "like",
		});
		expect(result1.data).not.toBeNull();

		// unlike this note
		const result2 = await testContract.link.unlinkNote({
			fromCharacterId: characterId1,
			toCharacterId: characterId1,
			toNoteId: note.data.noteId,
			linkType: "like",
		});
		expect(result2.data).not.toBeNull();
	});
});
