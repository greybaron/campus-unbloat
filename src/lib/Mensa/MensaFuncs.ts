import { browser } from '$app/environment';
import { getNextWeekdayString } from '$lib/TSHelpers/DateHelper';
import type { MensaMeal } from '$lib/types';

export async function fetchMeals(mensaId: number): Promise<MensaMeal[] | undefined> {
	if (browser) {
		const date = getNextWeekdayString();
		const res = await fetch(`/api/get_day_at_mensa/?mensa=${mensaId}&date=${date}`);

		if (!res.ok) {
			throw new Error(await res.text());
		} else {
			return res.json();
		}
	}
}
