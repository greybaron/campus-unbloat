import { env } from '$env/dynamic/private';

export async function GET({ params }) {
	try {
		const { canteen, date } = params;
		const response = await fetch(`${env.MENSA_API_URL}/canteens/${canteen}/days/${date}`);

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
