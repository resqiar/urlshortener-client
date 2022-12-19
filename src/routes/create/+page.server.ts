import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch, cookies }) => {
	const token = cookies.get('token');

	if (!token) throw redirect(307, '/auth');

	const res = await fetch('http://localhost:3333/v1/user/profile', {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});

	const item = await res.json();

	if (item.error === 'Unauthorized') {
		throw redirect(307, '/login');
	}

	return { id: item.id, token: token };
}) satisfies PageServerLoad;
