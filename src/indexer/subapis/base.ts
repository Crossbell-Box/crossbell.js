import { createCache } from 'async-cache-dedupe'
import { type MaybeArray } from '../../types/utils'
import { createSearchParamsString, getHeadersScope } from '../utils'

export type FetchOptions = Omit<RequestInit, 'method'>
export type IndexerOptions =
	| string
	| {
			endpoint?: string
			fetchOptions?: FetchOptions
			/**
			/**
			 * This option is used to enable the experimental request dedupe feature for performance.
			 *
			 * When this option is enabled, the `indexer` client will cache the response of same requests until the promises are resolved.
			 *
			 * For example, if you call `indexer.character.getMany('0x123')` many times **at the same time**, the indexer will only send one request to the server.
			 *
			 * ```ts
			 * await Promise.all([
			 *   indexer.character.getMany('0x123'),
			 *   indexer.character.getMany('0x123'),
			 *   indexer.character.getMany('0x123'),
			 *   indexer.character.getMany('0xabc'),
			 *   indexer.character.getMany('0xabc'),
			 * ]) // only 2 requests (one for `0x123`; one for `0xabc`) will be sent to the indexer server
			 * ```
			 *
			 * This only works for GET requests.
			 *
			 * @default false
			 */
			experimentalRequestDedupe: boolean
	  }

type InternalFetchOptions = RequestInit & {
	params?: Record<
		string,
		boolean | MaybeArray<string | number | bigint> | null | undefined
	>
	data?: any
	token?: string
}

export class BaseIndexer {
	/** The indexer endpoint */
	endpoint = 'https://indexer.crossbell.io/v1'

	/** The options to send to the fetch function. */
	fetchOptions: FetchOptions = {}

	#cache = createCache({
		ttl: 0,
		storage: { type: 'memory' },
	}).define(
		'fetch',
		{
			serialize(
				args: [input: RequestInfo | URL, init?: RequestInit | undefined],
			) {
				const url = args[0]
				const options = args[1]
				const body = options?.body
				const headers = Object.fromEntries(
					(options?.headers as Headers)?.entries(),
				)
				return {
					url,
					...options,
					body,
					headers,
				}
			},
		},
		(args: [input: RequestInfo | URL, init?: RequestInit | undefined]) => {
			return fetch.call(globalThis, ...args)
		},
	)

	constructor(private endpointOrOptions?: IndexerOptions) {
		if (typeof endpointOrOptions === 'string') {
			this.endpoint = endpointOrOptions
		} else if (typeof endpointOrOptions === 'object') {
			this.endpoint = endpointOrOptions.endpoint ?? this.endpoint
			this.fetchOptions = endpointOrOptions.fetchOptions ?? this.fetchOptions
		} else if (typeof endpointOrOptions !== 'undefined') {
			throw new TypeError(
				`Invalid argument: ${JSON.stringify(
					endpointOrOptions,
				)}. It must be a string or an object.`,
			)
		}
	}

	fetch<T>(
		url: string,
		{ params, data, token, ...options }: InternalFetchOptions = {},
	): Promise<T> {
		const newUrl = url + (params ? `?${createSearchParamsString(params)}` : '')

		const headers = new Headers({
			...this.fetchOptions.headers,
			...options.headers,
			...getHeadersScope(),
		})
		let body: string | undefined

		if (data) {
			body = JSON.stringify(data)
			headers.set('Content-Type', 'application/json')
		}

		if (token) {
			headers.set('Authorization', `Bearer ${token}`)
		}

		const fetched =
			typeof this.endpointOrOptions === 'object' &&
			this.endpointOrOptions.experimentalRequestDedupe &&
			(!options.method || options.method === 'GET')
				? this.#cache.fetch([
						this.endpoint + newUrl,
						{
							...this.fetchOptions,
							body,
							...options,
							headers,
						},
				  ])
				: fetch(this.endpoint + newUrl, {
						...this.fetchOptions,
						body,
						...options,
						headers,
				  })

		return fetched.then(async (r) => {
			const res = r.clone()
			if (!res.ok) {
				return Promise.reject(
					new Error(
						`Request failed, status code: ${
							r.status
						}\nResponse:\n${await res.text()}`,
					),
				)
			}
			return res.json()
		})
	}
}
