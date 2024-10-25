import type { CharacterMetadata } from "./character";
import type { NoteMetadata } from "./note";

export type Metadata = CharacterMetadata | NoteMetadata;

export * from "./base";
export * from "./character";
export * from "./note";
