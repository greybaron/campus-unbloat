import { env } from '$env/dynamic/private';

export async function GET({ url }) {
	try {
		let mensaId = url.searchParams.get('mensa');
		let date = url.searchParams.get('date');

		const response = await fetch(
			`${env.MENSA_API_URL}/get_day_at_mensa?mensa=${mensaId}&date=${date}`
		);

		if (!response.ok) {
			throw new Error();
		}

		return response;
	} catch (error) {
		console.error('Error at get_day_at_mensa:');
		if (error instanceof Error) {
			console.error(error.message);
		}
		return new Response('Mensa-Abfrage ist fehlgeschlagen', { status: 500 });
	}
}
