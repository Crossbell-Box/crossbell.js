import '../fetch'

export class BaseIndexer {
  /** The indexer endpoint */
  endpoint = 'https://test-indexer.crossbell.io/api/v0.1.0'

  constructor(endpoint?: string) {
    if (endpoint) {
      this.endpoint = endpoint
    }
  }
}
