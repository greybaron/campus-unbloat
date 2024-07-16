import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export async function GET({ url }) {
	let mensaId = url.searchParams.get('mensa');
	let date = url.searchParams.get('date');

	const response = await fetch(
		`${env.MENSA_API_URL}/get_day_at_mensa?mensa=${mensaId}&date=${date}`
	);

	if (!response.ok) {
		return json({ error: 'Failed to fetch meals' }, { status: response.status });
	}

	const mealList = await response.json();
	return json(mealList);
}
