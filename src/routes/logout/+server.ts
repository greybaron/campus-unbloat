import { redirect } from '@sveltejs/kit';

export async function POST({ cookies }) {
	// Unset the cookie by clearing content
	cookies.set('jwt', '', {
		path: '/',
		sameSite: 'lax',
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production'
	});

	// Redirect to the home page
	throw redirect(303, '/');
}
