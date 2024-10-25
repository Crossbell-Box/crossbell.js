export interface EmailUserEntity {
	email: string;
	characterId?: number;
	characterWithdrawnAt?: string;
	characterWithdrawnTo?: string;
	csb?: string;
	createdAt: string;
	updatedAt: string;
	deletedAt?: string;
}
