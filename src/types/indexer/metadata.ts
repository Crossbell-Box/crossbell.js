import { NoteMetadata, CharacterMetadata } from './../metadata'

export type MetadataType = 'CHARACTER' | 'NOTE' | 'LINKLIST'

export type MetadataEntity<T extends MetadataType> = {
  uri?: string
  type?: MetadataType | null
  content?:
    | (T extends 'CHARACTER'
        ? CharacterMetadata
        : T extends 'NOTE'
        ? NoteMetadata
        : object)
    | null
}
