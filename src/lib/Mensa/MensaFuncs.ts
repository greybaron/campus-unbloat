import { browser } from '$app/environment';

import { getDateAsUrlParam } from '$lib/TSHelpers/DateHelper';
import type { MensaMeal, MensaSubMeal, openMensaMeal } from '$lib/types';

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

export async function fetchOpenMeals(
	date: Date,
	mensaId: number
): Promise<MensaMeal[] | undefined> {
	if (browser) {
		const date_str = getDateAsUrlParam(date);
		const res = await fetch(
			`https://openmensa.org/api/v2/canteens/${mensaId}/days/${date_str}/meals`
		);

		if (!res.ok) {
			if (res.status === 404) {
				return [];
			} else {
				throw new Error(await res.text());
			}
		} else {
			const meals: openMensaMeal[] = await res.json();
			return openMensaMealToMensaMeal(meals);
		}
	}
}

function openMensaMealToMensaMeal(openMeals: openMensaMeal[]): MensaMeal[] {
	const mealMap: Map<string, MensaSubMeal[]> = new Map();

	for (const openMeal of openMeals) {
		const priceStr = openMealToPrice(openMeal.prices);
		if (mealMap.has(openMeal.category)) {
			mealMap.get(openMeal.category)!.push({
				name: openMeal.name,
				additional_ingredients: openMeal.notes,
				price: priceStr
			});
		} else {
			mealMap.set(openMeal.category, [
				{
					name: openMeal.name,
					additional_ingredients: openMeal.notes,
					price: priceStr
				}
			]);
		}
	}

	return Array.from(mealMap).map(([key, value]) => {
		return {
			meal_type: key,
			sub_meals: value
		};
	});
}

function openMealToPrice(prices: {
	students: number;
	employees: number;
	pupils: number;
	others: number;
}): string {
	let priceStr = '';
	for (const price of Object.entries(prices)) {
		if (price[1]) {
			priceStr += `${price[1].toFixed(2).replace('.', ',')} € / `;
		}
	}

	return priceStr.slice(0, -3);
}
