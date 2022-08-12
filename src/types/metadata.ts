export interface BaseMetadata {
  // version: '1' // TODO: do we need this?

  type?: 'character' | 'note' | 'linklist'
}

export interface CharacterMetadata extends BaseMetadata {
  /** The name of this character. */
  name?: string

  /**
   * The avatars of this character.
   * The first avatar is the primary avatar.
   * @example
   * ['ipfs://Qm...', 'ipfs://Qm...']
   **/
  avatars?: string[]

  /** The bio of this character. */
  bio?: string

  /**
   * The websites of this character.
   * @example
   * ['https://example.com', 'https://example.org']
   */
  websites?: string[]

  /**
   * The social links of this character. It should follow the csb:// scheme.
   *
   * The format is `csb://account:<identity>@<platform>`.
   *
   * @example
   * ['csb://account:someone@twitter', 'csb://account:someone@github']
   */
  connected_accounts?: string[]

  /**
   * The special connected avatars of this character. it should follow the csb:// scheme.
   *
   * Use case: use an NFT as avatar.
   *
   * The format is `csb://asset:<contract_address>-<token_id>@<network>`.
   *
   * @example
   * ['csb://asset:0x5452c7fb99d99fab3cc1875e9da9829cb50f7a13-753@ethereum']
   */
  connected_avatars?: string[]
}

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

export interface NoteMetadata extends BaseMetadata {
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
  attachments?:
    | (
        | NoteMetadataAttachmentBase<'address'>
        | NoteMetadataAttachmentBase<'content'>
      )[]

  /**
   * Custom attributes.
   *
   * @example
   * [{ value: "post", trait_type: "type" }, { value: "https://example.com", trait_type: "url" }]
   */
  attributes?: {
    value: string | number | boolean | null
    trait_type?: string
    display_type?: 'string' | 'number' | 'date' | 'boolean'
  }[]

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
   * A content warning for this note. On the client side, this will be displayed as a warning.
   *
   * @example
   * 'nsfw'
   */
  content_warning?: 'nsfw' | 'sensitive' | 'spoiler'
}

export type Metadata = CharacterMetadata | NoteMetadata
