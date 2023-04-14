import { type CharacterMetadata, type NoteMetadata } from '../../types'
import { type BaseIndexer } from './base'

export class MetadataIndexer {
  constructor(private base: BaseIndexer) {}

  /**
   * (Re)sync a character's metadata.
   *
   * @param characterId - the character id
   */
  syncForCharacter(characterId: bigint) {
    const url = `/characters/${characterId}/metadata/sync`
    return this.base.fetch<CharacterMetadata>(url)
  }

  /**
   * (Re)sync a notes's metadata.
   *
   * @param characterId - the character id of the note's owner
   * @param noteId - the note id
   */
  syncForNote(characterId: bigint, noteId: bigint) {
    const url = `/notes/${characterId}/${noteId}/metadata/sync`
    return this.base.fetch<NoteMetadata>(url)
  }
}
