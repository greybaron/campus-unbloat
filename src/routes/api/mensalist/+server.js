import { env } from '$env/dynamic/private';

export async function GET() {
	try {
		const response = await fetch(`${env.MENSA_API_URL}/mensalist`);

		if (!response.ok) {
			throw new Error();
		}

		return response;
	} catch (error) {
		console.error('Error at mensalist:');
		if (error instanceof Error) {
			console.error(error.message);
		}
		return new Response('Mensalisten-Abfrage ist fehlgeschlagen', { status: 500 });
	}
}
