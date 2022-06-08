import '../../utils/fetch'

export class BaseIndexer {
  /** The indexer endpoint */
  endpoint = 'https://indexer.crossbell.io/v1'

  constructor(endpoint?: string) {
    if (endpoint) {
      this.endpoint = endpoint
    }
  }
}
