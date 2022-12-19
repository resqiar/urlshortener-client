import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch, params }) => {
	const short = params.slug;

	// return 404 error if short not provided
	if (!short) throw error(404);

	const query = await fetch(`http://localhost:3333/v1/url/${short}`);
	const result = await query.json();

	// return 404 error if short not provided
	if (result.status === 404) throw error(404);

	if (result[0].original_url) {
		throw redirect(307, result[0].original_url);
	}
}) satisfies PageServerLoad;
