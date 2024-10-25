import { describe, expect, test, vi } from "vitest";
import { createIndexer } from "../../src";

const indexer = createIndexer({
	experimentalRequestDedupe: true,
});

describe("dedupe-cache", () => {
	test("simple", async () => {
		const fakeResponse = { result: true };
		const fakeFetch = vi.fn<typeof fetch>(() =>
			Promise.resolve(new Response(JSON.stringify(fakeResponse))),
		);
		vi.stubGlobal("fetch", fakeFetch);

		const [result1, result2] = await Promise.all([
			indexer.fetch("/foo"),
			indexer.fetch("/foo"),
		]);

		expect(result1).toEqual(fakeResponse);
		expect(result2).toEqual(fakeResponse);
		expect(fakeFetch).toBeCalledTimes(1);

		vi.unstubAllGlobals();
	});

	test("complex", async () => {
		const fakeResponse = { result: true };
		const fakeFetch = vi.fn<typeof fetch>(() =>
			Promise.resolve(new Response(JSON.stringify(fakeResponse))),
		);
		vi.stubGlobal("fetch", fakeFetch);

		const [result1, result2] = await Promise.all([
			indexer.fetch("/foo", {
				params: { a: 1, b: 2 },
				headers: { "x-foo": "bar", "x-foo2": "bar" },
			}),
			indexer.fetch("/foo", {
				params: { b: 2, a: 1 },
				headers: { "x-foo2": "bar", "x-foo": "bar" }, // no matter the order
			}),
		]);

		expect(result1).toEqual(fakeResponse);
		expect(result2).toEqual(fakeResponse);
		expect(fakeFetch).toBeCalledTimes(1);

		vi.unstubAllGlobals();
	});

	test("different-params", async () => {
		const fakeResponse = { result: true };
		const fakeFetch = vi.fn<typeof fetch>(() =>
			Promise.resolve(new Response(JSON.stringify(fakeResponse))),
		);
		vi.stubGlobal("fetch", fakeFetch);

		const [result1, result2] = await Promise.all([
			indexer.fetch("/foo", { params: { a: 1, b: 2 } }),
			indexer.fetch("/foo", { params: { a: 2, b: 3 } }),
		]);

		expect(result1).toEqual(fakeResponse);
		expect(result2).toEqual(fakeResponse);
		expect(fakeFetch).toBeCalledTimes(2);

		vi.unstubAllGlobals();
	});

	test("different-headers", async () => {
		const fakeResponse = { result: true };
		const fakeFetch = vi.fn<typeof fetch>(() =>
			Promise.resolve(new Response(JSON.stringify(fakeResponse))),
		);
		vi.stubGlobal("fetch", fakeFetch);

		const [result1, result2] = await Promise.all([
			indexer.fetch("/foo", {
				params: { a: 1, b: 2 },
				headers: { "x-foo": "bar", "x-foo2": "bar" },
			}),
			indexer.fetch("/foo", {
				params: { a: 1, b: 2 },
				headers: { "x-foo": "baz", "x-foo2": "baz" },
			}),
		]);

		expect(result1).toEqual(fakeResponse);
		expect(result2).toEqual(fakeResponse);
		expect(fakeFetch).toBeCalledTimes(2);

		vi.unstubAllGlobals();
	});
});
