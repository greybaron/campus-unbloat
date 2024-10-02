import { browser } from '$app/environment';

import { getDateAsUrlParam } from '$lib/TSHelpers/DateHelper';
import type { MealGroup, SubMeal, openmensaMeal } from '$lib/types';

export async function fetchMeals(date: Date, canteenId: number): Promise<MealGroup[] | undefined> {
	if (browser) {
		const date_str = getDateAsUrlParam(date);
		const res = await fetch(`/api/mensa/canteens/${canteenId}/days/${date_str}`);

		if (!res.ok) {
			throw new Error(await res.text());
		} else {
			return res.json();
		}
	}
}

export async function fetchOpenMeals(
	date: Date,
	canteenId: number
): Promise<MealGroup[] | undefined> {
	if (browser) {
		const date_str = getDateAsUrlParam(date);
		const res = await fetch(
			`https://openmensa.org/api/v2/canteens/${canteenId}/days/${date_str}/meals`
		);

		if (!res.ok) {
			if (res.status === 404) {
				return [];
			} else {
				throw new Error(await res.text());
			}
		} else {
			const meals: openmensaMeal[] = await res.json();
			return openMensaMealsToMealGroups(meals);
		}
	}
}

function openMensaMealsToMealGroups(openMeals: openmensaMeal[]): MealGroup[] {
	const mealMap: Map<string, SubMeal[]> = new Map();

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
