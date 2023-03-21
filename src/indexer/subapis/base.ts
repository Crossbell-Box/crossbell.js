import '../../utils/fetch'

export class BaseIndexer {
  /** The indexer endpoint */
  endpoint: string = 'https://indexer.crossbell.io/v1'

  /** The options to send to the fetch function. */
  fetchOptions: Omit<RequestInit, 'method'> = {}

  constructor(
    endpointOrOptions?:
      | string
      | {
          endpoint?: string
          fetchOptions?: (typeof BaseIndexer)['prototype']['fetchOptions']
        },
  ) {
    if (typeof endpointOrOptions === 'string') {
      this.endpoint = endpointOrOptions
    } else if (typeof endpointOrOptions === 'object') {
      this.endpoint = endpointOrOptions.endpoint ?? this.endpoint
      this.fetchOptions = endpointOrOptions.fetchOptions ?? this.fetchOptions
    } else if (typeof endpointOrOptions !== 'undefined') {
      throw new Error(
        `Invalid argument: ${JSON.stringify(
          endpointOrOptions,
        )}. It must be a string or an object.`,
      )
    }
  }

  fetch(url: string, options: RequestInit = {}) {
    return fetch(url, {
      ...this.fetchOptions,
      ...options,
    })
  }
}
