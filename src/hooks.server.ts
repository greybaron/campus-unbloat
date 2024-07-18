import type { Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

if (!env.CD_API_URL) {
	console.error('environment variable CD_API_URL is not set');
	process.exit(1);
}
if (!env.MENSA_API_URL) {
	console.error('environment variable MENSA_API_URL is not set');
	process.exit(1);
}

export const handle: Handle = async ({ event, resolve }) => {
	// only check cookie existence for non-api routes for performance reasons
	if (!event.route?.id?.includes('api')) {
		const jwt = event.cookies.get('jwt');

		if (!jwt && event.url.pathname !== '/') {
			console.log('redirecting to /');
			return Response.redirect(new URL('/', event.url));
		}

		if (jwt && event.url.pathname === '/') {
			console.log('redirecting to /dashboard');
			return Response.redirect(new URL('/dashboard', event.url));
		}
	}

	return resolve(event);
};
