import { env } from '$env/dynamic/private';
import { error, redirect } from '@sveltejs/kit';

export async function load({ cookies }) {
	const jwt = cookies.get('jwt');

	const response = await fetch(`${env.CD_API_URL}/check_revive_session`, {
		headers: {
			Authorization: `Bearer ${jwt}`
		}
	});

	if (!response.ok) {
		switch (response.status) {
			// unauthorized means backend re-login failed, therefore delete the session
			case 401:
				cookies.set('jwt', '', {
					path: '/',
					sameSite: 'lax',
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production'
				});
				throw redirect(303, '/login');
			case 429:
				return error(429, 'Zu viele Anfragen');
			default:
				return error(response.status, await response.text());
		}
	}

	const loginResponse = await response.json();

	// status is ok, got LR = session was refreshed
	if (loginResponse) {
		console.log('updating jwt cookie');
		cookies.set('jwt', loginResponse.token, {
			path: '/',
			sameSite: 'lax',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 7 * 13
		});
		cookies.set('user_basic', JSON.stringify(loginResponse.user), {
			path: '/',
			sameSite: 'lax',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 7 * 13
		});
	}

	const user_basic = cookies.get('user_basic');

	return {
		user_basic
	};
}
