import { type AttributesMetadata, type BaseMetadata } from './base'

export interface NoteMetadataAttachmentBase<
  ContentType extends 'address' | 'content',
> {
  /**
   * The name of this attachment.
   */
  name?: string

  /**
   * The address (url) of this attachment.
   */
  address?: ContentType extends 'address' ? string : never

  /**
   * The plain content of this attachment.
   */
  content?: ContentType extends 'content' ? string : never

  /**
   * The mime type of the `content`.
   */
  mime_type?: string

  /**
   * The size of the `content` in bytes.
   */
  size_in_bytes?: number

  /**
   * The alternate text (description) of this attachment.
   * This is used for accessibility or is displayed when the source is not available.
   */
  alt?: string

  /**
   * The width of this attachment, in pixels.
   */
  width?: number

  /**
   * The height of this attachment, in pixels.
   */
  height?: number
}

export interface NoteMetadata extends BaseMetadata, AttributesMetadata {
  /**
   * The tags of this note.
   *
   * @example
   * ['article', 'dairy']
   */
  tags?: string[]

  /**
   * The title of this note.
   */
  title?: string

  /**
   * The (markdown) content of this note.
   *
   * @example
   * '# Hello World\n\nThis is a markdown note.'
   */
  content?: string

  /**
   * The attachments of this note.
   */
  attachments?: (
    | NoteMetadataAttachmentBase<'address'>
    | NoteMetadataAttachmentBase<'content'>
  )[]

  /**
   * The source of this note. I.e. where it was originally created.
   * For example, it could be your app's name so that you could filtering the notes by the source in your app.
   *
   * @example
   * ['xlog']
   */
  sources?: string[]

  /**
   * Where this note was created. User can view this note on this location.
   *
   * @example
   * ['https://twitter.com/_Crossbell/status/1555900801058488322']
   */
  external_urls?: string[]

  /**
   * The date this content was published, following the ISO 8601 format.
   *
   * Example case: a blog post was originally published on a website at time A,
   * then was synced to the blockchain at time B.
   * The `date_published` of the note is time A.
   * The date of the blockchain sync is time B (shown as the `createdAt` field
   * in the indexer's response).
   *
   * @example
   * '2022-01-01T00:00:00Z'
   */
  date_published?: string

  /**
   * A content warning for this note. On the client side, this will be displayed as a warning.
   *
   * @example
   * 'nsfw'
   */
  content_warning?: 'nsfw' | 'sensitive' | 'spoiler'

  /**
   * The variant of this note.
   *
   * - `undefined`: the normal note.
   * - `"achievement"`: the achievement variant.
   *
   * @example
   * 'achievement'
   */
  variant?: 'achievement'
}
