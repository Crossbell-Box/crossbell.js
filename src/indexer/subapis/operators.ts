import { type Address } from 'viem'
import { createSearchParamsString } from '../../utils'
import {
  type CharacterOperatorEntity,
  type ListResponse,
  type NoteOperatorEntity,
  type Numberish,
} from '../../types'
import { BaseIndexer } from './base'

export class OperatorIndexer extends BaseIndexer {
  /**
   * This returns a list of operators for a specific character.
   * @category Operator
   * @param characterId - The id of the character.
   * @param options - The options to send to the indexer.
   * @returns The list of operators.
   */
  async getCharacterOperators(
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
  ): Promise<ListResponse<CharacterOperatorEntity>> {
    let url = `${this.endpoint}/characters/${characterId}/operators?`
    url += createSearchParamsString({ limit, cursor })

    const res = await this.fetch(url).then((res) => res.json())

    return res as ListResponse<CharacterOperatorEntity>
  }

  /**
   * This returns a list of operators for a specific note.
   * @category Operator
   * @param characterId - The id of the character.
   * @param noteId - The id of the note.
   * @returns The list of operators.
   */
  async getNoteOperators(
    characterId: Numberish,
    noteId: Numberish,
  ): Promise<NoteOperatorEntity> {
    const url = `${this.endpoint}/characters/${characterId}/notes/${noteId}/operators?`
    // url += createSearchParamsString()

    const res = await this.fetch(url).then((res) => res.json())

    return res as NoteOperatorEntity
  }

  /**
   * This returns the operator of a character; null if none exists.
   * @category Operator
   * @param characterId - The id of the character.
   * @param address - The address of the operator.
   * @returns The primary character.
   */
  async getCharacterOperator(
    characterId: Numberish,
    address: Address,
  ): Promise<CharacterOperatorEntity | null> {
    const url = `${this.endpoint}/characters/${characterId}/operators/${address}`

    const res = await this.fetch(url).then((res) => res.json())

    return res as CharacterOperatorEntity
  }

  /**
   * This returns the operator of a note; null if none exists.
   * @category Operator
   * @param characterId - The id of the character.
   * @param noteId - The id of the note.
   * @param address - The address of the operator.
   * @returns The primary character.
   */
  async getNoteOperator(
    characterId: Numberish,
    noteId: Numberish,
    address: Address,
  ): Promise<NoteOperatorEntity | null> {
    const url = `${this.endpoint}/characters/${characterId}/notes/${noteId}/operators/${address}`

    const res = await this.fetch(url).then((res) => res.json())

    return res as NoteOperatorEntity
  }
}
