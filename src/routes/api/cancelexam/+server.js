import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export async function POST({ request, cookies }) {
	const token = cookies.get('jwt');

	if (!token) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		let text = await request.text();
		console.error(text);

		const response = await fetch(`${env.CD_API_URL}/cancelexam`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			body: text
		});

		if (!response.ok) {
			throw new Error();
		}

		return response;
	} catch (error) {
		console.error('Error at examstats:');
		if (error instanceof Error) {
			console.error(error.message);
		}
		return new Response('CaDu: Klausurabmeldung fehlgeschlagen', { status: 500 });
	}
}
