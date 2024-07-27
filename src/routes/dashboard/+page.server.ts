import { env } from '$env/dynamic/private';
import { inThirteenWeeks } from '$lib/TSHelpers/DateHelper';
import { redirect } from '@sveltejs/kit';

export async function load({ cookies }) {
	const jwt = cookies.get('jwt');

	const response = await fetch(`${env.CD_API_URL}/check_revive_session`, {
		headers: {
			Authorization: `Bearer ${jwt}`
		}
	});

	if (!response.ok) {
		console.log('resp not ok');
		return redirect(303, '/logout');
	}

	const text = await response.text();
	if (text != '') {
		console.log('updating jwt cookie');
		cookies.set('jwt', text, {
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
