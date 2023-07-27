import { LinkIndexer } from './subapis/link'
import { LinklistIndexer } from './subapis/linklist'
import { NoteIndexer } from './subapis/note'
import { CharacterIndexer } from './subapis/character'
import { SearchIndexer } from './subapis/search'
import { FeedIndexer } from './subapis/feed'
import { MintedNoteIndexer } from './subapis/minted_note'
import { MetadataIndexer } from './subapis/metadata'
import { AchievementIndexer } from './subapis/achievement'
import { NotificationIndexer } from './subapis/notification'
import { OperatorIndexer } from './subapis/operators'
import { TipIndexer } from './subapis/tip'
import { LinkModuleIndexer } from './subapis/link_module'
import { MintModuleIndexer } from './subapis/mint_module'
import { BaseIndexer, type IndexerOptions } from './subapis/base'
import { NewbieIndexer } from './subapis/newbie'
import { SiweIndexer } from './subapis/siwe'

/**
 * This class is used to fetch data like characters, links from the indexer.
 *
 * @example
 * ```js
 * import { createIndexer } from 'crossbell'
 *
 * const indexer = createIndexer()
 * const res = await indexer.character.getMany('0x...')
 * console.log(res.list)
 * ```
 *
 * @see https://indexer.crossbell.io/docs The underlying APIs.
 */
export class Indexer extends BaseIndexer {
  link = new LinkIndexer(this)
  linklist = new LinklistIndexer(this)
  note = new NoteIndexer(this)
  character = new CharacterIndexer(this)
  search = new SearchIndexer(this)
  feed = new FeedIndexer(this)
  mintedNote = new MintedNoteIndexer(this)
  metadata = new MetadataIndexer(this)
  achievement = new AchievementIndexer(this)
  notification = new NotificationIndexer(this)
  operator = new OperatorIndexer(this)
  tip = new TipIndexer(this)
  linkModule = new LinkModuleIndexer(this)
  mintModule = new MintModuleIndexer(this)
  newbie = new NewbieIndexer(this)
  siwe = new SiweIndexer(this)
}

/**
 * This function is used to create an indexer, and fetch data like characters, links from the indexer.
 *
 * @example
 * ```js
 * import { createIndexer } from 'crossbell'
 *
 * const indexer = createIndexer()
 * const res = await indexer.character.getMany('0x...')
 * console.log(res.list)
 * ```
 *
 * @see https://indexer.crossbell.io/docs The underlying APIs.
 */
export function createIndexer(endpointOrOptions?: IndexerOptions) {
  return new Indexer(endpointOrOptions)
}
