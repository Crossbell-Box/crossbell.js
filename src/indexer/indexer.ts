import { Mixin } from 'ts-mixer'
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

const Indexers = Mixin(
  CharacterIndexer,
  LinklistIndexer,
  LinkIndexer,
  NoteIndexer,
  MintedNoteIndexer,
  SearchIndexer,
  FeedIndexer,
  MetadataIndexer,
  AchievementIndexer,
  NotificationIndexer,
)

/**
 * This class is used to fetch data like characters, links from the indexer.
 *
 * @example
 * ```js
 * import { Indexer } from 'crossbell.js'
 *
 * const indexer = new Indexer()
 * const res = await indexer.getCharacters('0x...')
 * console.log(res.list)
 * ```
 *
 * @see https://indexer.crossbell.io/docs The underlying APIs.
 */
export class Indexer extends Indexers {}
