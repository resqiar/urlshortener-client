export interface Inventory {
	// Inventory URL related fields
	id: string;
	original_url: string;
	short_url: string;
	description: string | null;
	visits: number;
	created_at: string;
	expire_at: string;

	// Author related fields
	author_id: string;
	avatar_url: string | null;
	email: string;
	username: string;
}
