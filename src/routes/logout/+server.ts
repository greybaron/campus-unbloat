import { redirect } from '@sveltejs/kit';

export async function POST({ cookies }) {
	// Unset the cookie by setting its expiry date to a date in the past
	cookies.set('jwt', '', {
		path: '/',
		sameSite: 'strict',
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production'
	});

	// Redirect to the home page
	throw redirect(303, '/');
}
