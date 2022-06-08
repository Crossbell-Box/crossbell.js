import { Mixin } from 'ts-mixer'
import { LinkIndexer } from './subapis/link'
import { LinklistIndexer } from './subapis/linklist'
import { NoteIndexer } from './subapis/note'
import { ProfileIndexer } from './subapis/profile'
import { SearchIndexer } from './subapis/search'

const Indexers = Mixin(
  ProfileIndexer,
  LinklistIndexer,
  LinkIndexer,
  NoteIndexer,
  SearchIndexer,
)

/**
 * This class is used to fetch data like profiles, links from the indexer.
 *
 * @example
 * ```js
 * import { Indexer } from 'crossbell.js'
 *
 * const indexer = new Indexer()
 * const res = await indexer.getProfiles('0x...')
 * console.log(res.list)
 * ```
 *
 * @see https://indexer.crossbell.io/docs The underlying APIs.
 */
export class Indexer extends Indexers {}
