import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export async function GET({ cookies }) {
	const token = cookies.get('jwt');
	if (!token) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const response = await fetch(`${env.CD_API_URL}/check_session_alive`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});

		if (!response.ok) {
			return json(false);
		} else {
			return json(true);
		}
	} catch (error) {
		console.error('Error at check_session_alive:');
		if (error instanceof Error) {
			console.error(error.message);
		}

		return new Response('Der CaDu-Cookie konnte nicht validiert werden', { status: 500 });
	}
}
