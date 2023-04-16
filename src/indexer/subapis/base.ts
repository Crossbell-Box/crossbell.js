import { type MaybeArray } from '../../types/utils'
import { createSearchParamsString } from '../../utils'

export type FetchOptions = Omit<RequestInit, 'method'>
type InternalFetchOptions = RequestInit & {
  params?: Record<
    string,
    boolean | MaybeArray<string | number | bigint> | null | undefined
  >
}

export class BaseIndexer {
  /** The indexer endpoint */
  endpoint = 'https://indexer.crossbell.io/v1'

  /** The options to send to the fetch function. */
  fetchOptions: FetchOptions = {}

  constructor(
    endpointOrOptions?:
      | string
      | { endpoint?: string; fetchOptions?: FetchOptions },
  ) {
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
    { params, ...options }: InternalFetchOptions = {},
  ): Promise<T> {
    if (params) url += `?${createSearchParamsString(params)}`
    return fetch(this.endpoint + url, {
      ...this.fetchOptions,
      ...options,
    }).then(async (r) => {
      if (r.status !== 200) {
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
