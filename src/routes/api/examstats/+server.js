import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export async function GET({ cookies }) {
	const token = cookies.get('jwt');

	if (!token) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const response = await fetch(`${env.CD_API_URL}/get_examstats`, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});

	if (!response.ok) {
		return json({ error: 'Failed to fetch exam stats' }, { status: response.status });
	}

	const stats = await response.json();
	return json(stats);
}
