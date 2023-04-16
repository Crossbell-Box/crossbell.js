import { type Address } from 'viem'
import {
  type CharacterOperatorEntity,
  type ListResponse,
  type NoteOperatorEntity,
  type Numberish,
} from '../../types'
import { type BaseIndexer } from './base'

export class OperatorIndexer {
  constructor(private base: BaseIndexer) {}

  /**
   * This returns a list of operators for a specific character.
   * @category Operator
   * @param characterId - The id of the character.
   * @param options - The options to send to the indexer.
   * @returns The list of operators.
   */
  getManyForCharacter(
    characterId: Numberish,
    {
      limit = 20,
      cursor,
    }: {
      /** Limit the count of items returned. */
      limit?: number
      /** Used for pagination. */
      cursor?: string
    } = {},
  ) {
    const url = `/characters/${characterId}/operators`
    return this.base.fetch<ListResponse<CharacterOperatorEntity>>(url, {
      params: { limit, cursor },
    })
  }

  /**
   * This returns a list of operators for a specific note.
   * @category Operator
   * @param characterId - The id of the character.
   * @param noteId - The id of the note.
   * @returns The list of operators.
   */
  getManyForNote(characterId: Numberish, noteId: Numberish) {
    const url = `/characters/${characterId}/notes/${noteId}/operators`
    return this.base.fetch<NoteOperatorEntity>(url)
  }

  /**
   * This returns the operator of a character; null if none exists.
   * @category Operator
   * @param characterId - The id of the character.
   * @param address - The address of the operator.
   * @returns The primary character.
   */
  getForCharacter(characterId: Numberish, address: Address) {
    const url = `/characters/${characterId}/operators/${address}`
    return this.base.fetch<CharacterOperatorEntity | null>(url)
  }

  /**
   * This returns the operator of a note; null if none exists.
   * @category Operator
   * @param characterId - The id of the character.
   * @param noteId - The id of the note.
   * @param address - The address of the operator.
   * @returns The primary character.
   */
  getForNote(characterId: Numberish, noteId: Numberish, address: Address) {
    const url = `/characters/${characterId}/notes/${noteId}/operators/${address}`
    return this.base.fetch<NoteOperatorEntity | null>(url)
  }
}
