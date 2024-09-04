import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export async function POST({ request, cookies }) {
	const token = cookies.get('jwt');

	if (!token) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		let text = await request.text();
		const response = await fetch(`${env.CD_API_URL}/cancelexam`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			body: text
		});

		if (!response.ok) {
			if (response.status === 429) {
				throw new ReferenceError();
			}
			throw new Error();
		}

		return response;
	} catch (error) {
		if (error instanceof ReferenceError) {
			return new Response('Zu viele Anfragen', { status: 429 });
		}

		console.error('Error at cancelexam:');
		if (error instanceof Error) {
			console.error(error.message);
		}
		return new Response('CaDu: Klausurabmeldung ist fehlgeschlagen', { status: 500 });
	}
}
