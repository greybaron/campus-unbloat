import { env } from '$env/dynamic/private';
import { inThirteenWeeks } from '$lib/TSHelpers/DateHelper';
import { error } from '@sveltejs/kit';

export async function load({ cookies }) {
	const jwt = cookies.get('jwt');

	const response = await fetch(`${env.CD_API_URL}/check_revive_session`, {
		headers: {
			Authorization: `Bearer ${jwt}`
		}
	});

	const loginResponse = await response.json();

	if (!response.ok) {
		return error(response.status, loginResponse.error);
	}

	// status is ok, got LR = session was refreshed
	if (loginResponse) {
		console.log('updating jwt cookie');
		cookies.set('jwt', loginResponse.token, {
			path: '/',
			sameSite: 'strict',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			expires: inThirteenWeeks()
		});
		cookies.set('user_basic', JSON.stringify(loginResponse.user), {
			path: '/',
			sameSite: 'strict',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			expires: inThirteenWeeks()
		});
	}

	const user_basic = cookies.get('user_basic');

	return {
		user_basic
	};
}
