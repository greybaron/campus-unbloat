import { fail, isRedirect, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { env } from '$env/dynamic/private';
import { inThirteenWeeks } from '$lib/TSHelpers/DateHelper';

export const actions: Actions = {
	login: async ({ cookies, request }) => {
		console.log(`fetch ${env.CD_API_URL}/signin`);
		const form = await request.formData();
		const username = form.get('username');
		const password = form.get('password');

		try {
			const response = await fetch(`${env.CD_API_URL}/signin`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					username: username,
					password: password
				})
			});

			if (!response.ok) {
				let message;
				if (response.status === 418) {
					message = 'CD-API: SSL-Fehler (Wahrscheinlich fehlt GEANT CA)';
				} else {
					message = 'Nutzer/Passwort ungültig';
				}

				return fail(401, {
					message
				});
			} else {
				const loginResponse = await response.json();

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
