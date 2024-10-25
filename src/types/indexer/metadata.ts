import type { CharacterMetadata, NoteMetadata } from "./../metadata";

export type MetadataType = "CHARACTER" | "NOTE" | "LINKLIST";

export interface MetadataEntity<T extends MetadataType> {
	uri?: string;
	type?: MetadataType | null;
	content?:
		| (T extends "CHARACTER"
				? CharacterMetadata
				: T extends "NOTE"
					? NoteMetadata
					: object)
		| null;
}
