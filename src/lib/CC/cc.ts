import { browser } from '$app/environment';

export async function load_cc() {
	if (browser) {
		try {
			const CookieConsent = await import('vanilla-cookieconsent');
			const config = (await import('$lib/CC/cookieconsent-config')).default;

			CookieConsent.run(config);
		} catch (error) {
			console.warn('Failed to load cookieconsent (likely due to content filter)');
		}
	}
}
