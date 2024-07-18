import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export async function GET({ cookies }) {
	const token = cookies.get('jwt');

	if (!token) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const response = await fetch(`${env.CD_API_URL}/check_session_alive`, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});

	if (!response.ok) {
		return json(false);
	}

	// const stats = response;
	return json(true);
}
