import { BaseIndexer } from './base'
import { type BigNumberish } from 'ethers'
import { CharacterStatEntity, NoteStatEntity } from '../../types'

export class StatIndexer extends BaseIndexer {
  /**
   * Get stat of a character.
   * @category Stat
   * @param characterId - The id of the character.
   * @returns The stat of the character.
   */
  async getStatOfCharacter(
    characterId: BigNumberish,
  ): Promise<CharacterStatEntity> {
    let url = `${this.endpoint}/stat/characters/${characterId}?`

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
    characterId: BigNumberish,
    noteId: BigNumberish,
  ): Promise<NoteStatEntity> {
    let url = `${this.endpoint}/stat/notes/${characterId}/${noteId}?`

    const res = await this.fetch(url).then((res) => res.json())

    return res as NoteStatEntity
  }
}
