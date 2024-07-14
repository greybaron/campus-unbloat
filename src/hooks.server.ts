import type { Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

if (!env.CD_API_URL) {
	console.error('CD_API_URL is not set');
	process.exit(1);
}

export const handle: Handle = async ({ event, resolve }) => {
	const jwt = event.cookies.get('jwt');

	if (!jwt && event.url.pathname !== '/') {
		console.log('redirecting to /');
		return Response.redirect(new URL('/', event.url));
	}

	if (jwt && event.url.pathname === '/') {
		console.log('redirecting to /dashboard');
		return Response.redirect(new URL('/dashboard', event.url));
	}

	return resolve(event);
};
