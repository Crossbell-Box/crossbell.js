import {
  type CharacterStatEntity,
  type NoteStatEntity,
  type Numberish,
} from '../../types'
import { type BaseIndexer } from './base'

export class StatIndexer {
  constructor(private base: BaseIndexer) {}

  /**
   * Get stat of a character.
   * @category Stat
   * @param characterId - The id of the character.
   * @returns The stat of the character.
   */
  getForCharacter(characterId: Numberish) {
    const url = `/stat/characters/${characterId}`
    return this.base.fetch<CharacterStatEntity>(url)
  }

  /**
   * Get stat of a note.
   * @category Stat
   * @param characterId - The id of the character.
   * @param noteId - The id of the note.
   * @returns The stat of the note.
   */
  getForNote(characterId: Numberish, noteId: Numberish) {
    const url = `/stat/notes/${characterId}/${noteId}`
    return this.base.fetch<NoteStatEntity>(url)
  }
}
