import { Mixin } from 'ts-mixer'
import { LinkIndexer } from './subapis/link'
import { ProfileIndexer } from './subapis/profile'
import { SearchIndexer } from './subapis/search'

const Indexers = Mixin(ProfileIndexer, LinkIndexer, SearchIndexer)

/**
 * This class is used to fetch data like profiles, links from the indexer.
 *
 * @example
 * ```
 * import { Indexer } from 'crossbell.js'
 *
 * const indexer = new Indexer()
 * const res = await indexer.getProfiles('0x...')
 * console.log(res.list)
 * ```
 */
export class Indexer extends Indexers {}
