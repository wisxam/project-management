export interface User {
	userId: number;
	username: string;
	profilePictureUrl?: string | null;
	teamId?: number | null;
	password: string;
}
