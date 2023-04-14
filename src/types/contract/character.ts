import { type CharacterMetadata } from '../metadata'

export interface Character {
  /** The id of this character. */
  characterId: bigint
  /** The handle of this character. */
  handle: string
  /** The metadata URI of this character. */
  uri: string
  /** The metadata of this character. */
  metadata?: CharacterMetadata
  /** The social token of this character. */
  socialToken: string
  /** The count of notes this character posted. */
  noteCount: bigint
}
