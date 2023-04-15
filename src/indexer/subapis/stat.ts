import {
  type CharacterStatEntity,
  type NoteStatEntity,
  type Numberish,
} from '../../types'
import { BaseIndexer } from './base'

export class StatIndexer extends BaseIndexer {
  /**
   * Get stat of a character.
   * @category Stat
   * @param characterId - The id of the character.
   * @returns The stat of the character.
   */
  async getStatOfCharacter(
    characterId: Numberish,
  ): Promise<CharacterStatEntity> {
    const url = `${this.endpoint}/stat/characters/${characterId}?`

    const res = await this.fetch(url).then((res) => res.json())

    return res as CharacterStatEntity
  }

  /**
   * Get stat of a note.
   * @category Stat
   * @param characterId - The id of the character.
   * @param noteId - The id of the note.
   * @returns The stat of the note.
   */
  async getStatOfNote(
    characterId: Numberish,
    noteId: Numberish,
  ): Promise<NoteStatEntity> {
    const url = `${this.endpoint}/stat/notes/${characterId}/${noteId}?`

    const res = await this.fetch(url).then((res) => res.json())

    return res as NoteStatEntity
  }
}
