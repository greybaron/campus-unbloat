import { redirect } from '@sveltejs/kit';

export async function GET({ cookies }) {
	// Unset the cookie by setting its expiry date to a date in the past
	cookies.set('jwt', '', {
		path: '/',
		expires: distantDate(),
		sameSite: 'strict',
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production'
	});

	// Redirect to the home page
	throw redirect(303, '/');
}

function distantDate() {
	const date = new Date();
	date.setFullYear(date.getFullYear() - 1);
	return date;
}
