import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export async function GET() {
	const response = await fetch(`${env.MENSA_API_URL}/mensalist`);

	if (!response.ok) {
		return json({ error: 'Failed to fetch exam stats' }, { status: response.status });
	}

	const mensaList = await response.json();
	return json(mensaList);
}
