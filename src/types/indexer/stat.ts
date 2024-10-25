export interface CharacterStatEntity {
	characterId: number;
	viewCount: number;
	viewInListCount: number;
	viewDetailCount: number;
	viewNoteCount: number;
}

export interface NoteStatEntity {
	characterId: number;
	noteId: number;
	viewCount: number;
	viewInListCount: number;
	viewDetailCount: number;
}
