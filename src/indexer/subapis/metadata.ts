import { BaseIndexer } from './base'
import type { BigNumberish } from 'ethers'
import type { CharacterMetadata, NoteMetadata } from '../../types'

export class MetadataIndexer extends BaseIndexer {
  /**
   * (Re)sync a character's metadata.
   *
   * @param characterId - the character id
   */
  async syncMetadataOfCharacter(
    characterId: BigNumberish,
  ): Promise<CharacterMetadata | never> {
    let url = `${this.endpoint}/characters/${characterId}/metadata/sync`

    const res = await fetch(url).then((res) => res.json())

    return res as CharacterMetadata
  }

  /**
   * (Re)sync a notes's metadata.
   *
   * @param characterId - the character id of the note's owner
   * @param noteId - the note id
   */
  async syncMetadataOfNote(
    characterId: BigNumberish,
    noteId: BigNumberish,
  ): Promise<NoteMetadata | never> {
    let url = `${this.endpoint}/notes/${characterId}/${noteId}/metadata/sync`

    const res = await fetch(url).then((res) => res.json())

    return res as NoteMetadata
  }
}
