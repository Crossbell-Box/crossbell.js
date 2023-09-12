import { type MaybeArray } from '../../types/utils'
import { createSearchParamsString } from '../../utils'
import { getHeadersScope } from '../utils'

export type FetchOptions = Omit<RequestInit, 'method'>
export type IndexerOptions =
	| string
	| { endpoint?: string; fetchOptions?: FetchOptions }

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

	constructor(endpointOrOptions?: IndexerOptions) {
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

		return fetch(this.endpoint + newUrl, {
			...this.fetchOptions,
			body,
			...options,
			headers,
		}).then(async (r) => {
			if (!r.ok) {
				return Promise.reject(
					new Error(
						`Request failed, status code: ${
							r.status
						}\nResponse:\n${await r.text()}`,
					),
				)
			}
			return r.json()
		})
	}
}
