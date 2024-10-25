import { beforeAll, describe, expect, test } from "vitest";
import { mockUser, testContract } from "../mock";

describe("should post note", () => {
	let characterId: bigint | null = null;
	beforeAll(async () => {
		const { data: pid } = await testContract.character.getPrimaryId({
			address: mockUser.address,
		});
		characterId = pid;
	});

	test("postNote and check", async () => {
		if (!characterId) throw new Error("characterId is null");
		const { data } = await testContract.note.post({
			characterId,
			metadataOrUri: {
				title: "test",
				content: "test",
			},
		});

		expect(data.noteId).toBeDefined();

		const { data: note } = await testContract.note.get({
			characterId,
			noteId: data.noteId,
		});
		expect(note.metadata?.title).toBe("test");
	});

	test("postNotes and check", async () => {
		if (!characterId) throw new Error("characterId is null");
		const { data } = await testContract.note.postMany({
			notes: [
				{
					characterId,
					metadataOrUri: {
						title: "test1",
						content: "test1",
					},
				},
				{
					characterId,
					metadataOrUri: {
						title: "test2",
						content: "test2",
					},
				},
			],
		});

		expect(data.noteIds).toHaveLength(2);

		const { data: note1 } = await testContract.note.get({
			characterId,
			noteId: data.noteIds[0],
		});
		expect(note1.metadata?.title).toBe("test1");

		const { data: note2 } = await testContract.note.get({
			characterId,
			noteId: data.noteIds[1],
		});
		expect(note2.metadata?.title).toBe("test2");
	});

	test("mintNote", async () => {
		if (!characterId) throw new Error("characterId is null");
		const { data } = await testContract.note.post({
			characterId,
			metadataOrUri: {
				title: "test",
				content: "test",
			},
		});

		expect(data.noteId).toBeDefined();

		const { transactionHash: mintHash } = await testContract.note.mint({
			characterId,
			noteId: data.noteId,
			toAddress: mockUser.address,
		});

		expect(mintHash).toBeDefined();

		// TODO: how do i check the NFT?
	});

	test("deleteNote", async () => {
		if (!characterId) throw new Error("characterId is null");
		const { data } = await testContract.note.post({
			characterId,
			metadataOrUri: {
				title: "test",
				content: "test",
			},
		});

		expect(data.noteId).toBeDefined();

		const { transactionHash: deleteHash } = await testContract.note.delete({
			characterId,
			noteId: data.noteId,
		});

		expect(deleteHash).toBeDefined();

		const { data: note } = await testContract.note.get({
			characterId,
			noteId: data.noteId,
		});
		expect(note.deleted).toBeTruthy();
	});

	test("postNoteForAnyUri", async () => {
		if (!characterId) throw new Error("characterId is null");
		const { data } = await testContract.note.postForAnyUri({
			characterId,
			metadataOrUri: { title: "test", content: "test" },
			targetUri: "https://example.com",
		});

		expect(data.noteId).toBeDefined();

		const { data: note } = await testContract.note.get({
			characterId,
			noteId: data.noteId,
		});
		expect(note.linkKey).toBe(
			testContract.note.getLinkKeyForAnyUri({ toUri: "https://example.com" }),
		);
	});
});
