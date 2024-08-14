import { fail, isRedirect, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { env } from '$env/dynamic/private';

export const actions: Actions = {
	login: async ({ cookies, request }) => {
		const form = await request.formData();
		const username = form.get('username');
		const password = form.get('password');

		// forward client IP (passed by reverse proxy) to API for rate limiting
		// never stored, only a hashed form is kept in memory for up to 2 mins since last login
		const x_fwd_for = request.headers.get('x-forwarded-for');

		try {
			const response = await fetch(`${env.CD_API_URL}/signin`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					...(x_fwd_for ? { 'X-Forwarded-For': x_fwd_for } : {})
				},
				body: JSON.stringify({
					username: username,
					password: password
				})
			});

			if (!response.ok) {
				let message;
				switch (response.status) {
					case 429:
						message = 'Zu viele Anfragen';
						break;
					case 401:
						message = 'Nutzer/Passwort ungültig';
						break;
					case 500:
						message = `Interner Fehler (500): ${await response.text()}`;
						break;
					default:
						message = `Unbekannter Fehler (${response.status}): (${await response.text()})`;
						break;
				}

				return fail(401, {
					message
				});
			} else {
				const loginResponse = await response.json();

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

				throw redirect(303, '/dashboard');
			}
		} catch (error) {
			if (!isRedirect(error)) {
				console.error('Error at login:');
				if (error instanceof Error) {
					console.error(error.message);
				}

				return fail(500, {
					message: 'CampusUnbloat ist nicht verfügbar.'
				});
			} else {
				throw error;
			}
		}
	}
};
