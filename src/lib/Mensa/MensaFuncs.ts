import { browser } from '$app/environment';

import { getDateAsUrlParam } from '$lib/TSHelpers/DateHelper';
import type { MensaMeal } from '$lib/types';

export async function fetchMeals(date: Date, mensaId: number): Promise<MensaMeal[] | undefined> {
	if (browser) {
		const date_str = getDateAsUrlParam(date);
		const res = await fetch(`/api/get_day_at_mensa?mensa=${mensaId}&date=${date_str}`);

		if (!res.ok) {
			throw new Error(await res.text());
		} else {
			return res.json();
		}
	}
}
