import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { describe, expect, test } from "vitest";
import {
	genRandomHandle,
	metadataUri,
	metadataUri2,
	mockUser,
	randomHandle,
	randomHandle2,
	testContract,
} from "../mock";

let characterId: bigint | null = null;

describe("character", () => {
	describe("create a character and check", () => {
		test("should fail to createCharacter if the handle is not in correct format", () => {
			expect(
				testContract.character.create({
					owner: mockUser.address,
					handle: "cannot contain whitespace",
					metadataOrUri: metadataUri,
				}),
			).rejects.toThrow(/Handle must only contain \[a-z0-9-_\]./);

			expect(
				testContract.character.create({
					owner: mockUser.address,
					handle:
						"cannot-contain-be-more-than-32-characters-longlonglonglonglonglonglonglonglong",
					metadataOrUri: metadataUri,
				}),
			).rejects.toThrow(/Handle must be between 3 and 31 characters/);
		});

		test("check if a character exists", async () => {
			const randAccount = privateKeyToAccount(generatePrivateKey());
			const randAddr = randAccount.address;
			const randHandle = genRandomHandle();

			// not exists if not created
			const { data: exists } = await testContract.character.existsForAddress({
				address: randAddr,
			});
			expect(exists).toBe(false);
			const { data: exists2 } = await testContract.character.existsForHandle({
				handle: randHandle,
			});
			expect(exists2).toBe(false);

			// create one
			const characterId = await testContract.character
				.create({
					owner: randAddr,
					handle: randHandle,
					metadataOrUri: metadataUri,
				})
				.then(({ data }) => data);

			expect(characterId).not.toBeNull();

			// should exist now
			const { data: exists3 } = await testContract.character.existsForAddress({
				address: randAddr,
			});
			expect(exists3).toBe(true);
			const { data: exists4 } = await testContract.character.existsForHandle({
				handle: randHandle,
			});
			expect(exists4).toBe(true);
		});

		test("createCharacter and getCharacterByTransaction", async () => {
			const result = await testContract.character.create({
				owner: mockUser.address,
				handle: randomHandle,
				metadataOrUri: metadataUri,
			});
			characterId = result.data;
			expect(result.data).not.toBeNull();

			const character = await testContract.character.getByTransaction({
				txHash: result.transactionHash,
			});
			expect(character.data.characterId).toBe(characterId);
		});

		test.concurrent("getCharacter", async () => {
			if (!characterId) throw new Error("characterId is null");
			const { data } = await testContract.character.get({
				characterId: characterId,
			});
			expect(data.handle).toBe(randomHandle);
			expect(data.uri).toBe(metadataUri);
		});

		test.concurrent("getCharacterByHandle", async () => {
			const { data } = await testContract.character.getByHandle({
				handle: randomHandle,
			});
			// expect(data.characterId).toBe(characterId)
			expect(data.handle).toBe(randomHandle);
			expect(data.uri).toBe(metadataUri);
		});

		test.concurrent("getHandle", async () => {
			if (!characterId) throw new Error("characterId is null");
			const { data } = await testContract.character.getHandle({
				characterId: characterId,
			});
			expect(data).toBe(randomHandle);
		});

		test.concurrent("getCharacterMetadataUri", async () => {
			if (!characterId) throw new Error("characterId is null");
			const { data } = await testContract.character.getUri({
				characterId: characterId,
			});
			expect(data).toBe(metadataUri);
		});
	});

	describe("change a character and check", () => {
		test("setPrimaryCharacter", async () => {
			if (!characterId) throw new Error("characterId is null");
			await testContract.character.setPrimaryId({ characterId: characterId });
		});

		test("getPrimaryCharacter", async () => {
			const { data } = await testContract.character.getPrimaryId({
				address: mockUser.address,
			});
			expect(data).toBe(characterId);
		});

		test("isPrimaryCharacterId", async () => {
			if (!characterId) throw new Error("characterId is null");
			const { data } = await testContract.character.isPrimaryId({
				characterId: characterId,
			});
			expect(data).toBe(true);
		});

		test("setHandle", async () => {
			if (!characterId) throw new Error("characterId is null");
			await testContract.character.setHandle({
				characterId: characterId,
				handle: randomHandle2,
			});
		});

		test("getHandle - after changed", async () => {
			if (!characterId) throw new Error("characterId is null");
			const { data } = await testContract.character.getHandle({
				characterId: characterId,
			});
			expect(data).toBe(randomHandle2);
		});

		test("setMetadataUri", async () => {
			if (!characterId) throw new Error("characterId is null");
			await testContract.character.setUri({
				characterId: characterId,
				metadataOrUri: metadataUri2,
			});
		});

		test("getMetadataUri", async () => {
			if (!characterId) throw new Error("characterId is null");
			const { data } = await testContract.character.getUri({
				characterId: characterId,
			});
			expect(data).toBe(metadataUri2);
		});
	});

	describe("change character metadata and check", () => {
		test("setCharacterMetadata", async () => {
			if (!characterId) throw new Error("characterId is null");
			await testContract.character.setMetadata({
				characterId: characterId,
				metadata: {
					name: "test-name",
					bio: "test-bio",
				},
			});

			const { data } = await testContract.character.get({
				characterId: characterId,
			});

			expect(data.metadata?.name).toBe("test-name");
			expect(data.metadata?.bio).toBe("test-bio");
		});

		test("changeCharacterMetadata", async () => {
			if (!characterId) throw new Error("characterId is null");
			await testContract.character.changeMetadata({
				characterId: characterId,
				modifier: (metadata) => {
					return {
						...metadata,
						name: "test-name-2",
					};
				},
			});
			const { data } = await testContract.character.get({
				characterId: characterId,
			});

			expect(data.metadata?.name).toBe("test-name-2");
			expect(data.metadata?.bio).toBe("test-bio");
		});
	});
});
