<script lang="ts">
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import type { Writable } from 'svelte/store';

	import type { MensaMeal } from '$lib/types';
	import MealGroupContainer from './MealGroupContainer.svelte';

	export let mensaMeals: MensaMeal[];
	export let expandedMealCategories: Writable<Array<string>>;

	function getGroupIcon(meal_type: string) {
		const icons: { [key: string]: string } = {
			vegan: 'fa-solid fa-leaf',
			vegetarisch: 'fa-solid fa-egg',
			fleisch: 'fa-solid fa-drumstick-bite',
			grill: 'fa-solid fa-burger',
			fisch: 'fa-solid fa-fish',
			pastateller: 'fa-solid fa-mortar-pestle',
			gemüse: 'fa-solid fa-carrot',
			sättigung: 'fa-solid fa-square-plus',
			'schneller teller': 'fa-solid fa-wheelchair-move'
		};

		const lowercasedMealType = meal_type.toLowerCase();

		for (const key in icons) {
			if (lowercasedMealType.includes(key)) {
				return icons[key];
			}
		}

		return 'fa-solid fa-utensils';
	}

	function getGroupColour(meal_type: string) {
		const icons: { [key: string]: string } = {
			vegan: 'bg-green-400/40',
			vegetarisch: 'bg-green-400/40',
			gemüse: 'bg-green-400/40',
			fleisch: 'bg-red-400/40',
			fisch: 'bg-blue-400/40',
			pastateller: 'bg-yellow-300/40'
		};

		const lowercasedMealType = meal_type.toLowerCase();

		for (const key in icons) {
			if (lowercasedMealType.includes(key)) {
				return icons[key];
			}
		}

		return 'bg-surface-100-800-token';
	}
</script>

<Accordion>
	{#each mensaMeals as meal}
		<AccordionItem
			hover="hover:dark:backdrop-brightness-200 hover:backdrop-brightness-90 transition-[backdrop-filter]"
			regionControl="{getGroupColour(meal.meal_type)} border border-surface-900-50-token"
			open={$expandedMealCategories.includes(meal.meal_type)}
			on:toggle={(e) => {
				expandedMealCategories.update((categories) => {
					if (e.detail.open) {
						return [...categories, meal.meal_type];
					} else {
						return categories.filter((cat) => cat !== meal.meal_type);
					}
				});
			}}
		>
			<svelte:fragment slot="lead">
				<i class="{getGroupIcon(meal.meal_type)} scale-125"></i>
			</svelte:fragment>
			<svelte:fragment slot="summary">{meal.meal_type}</svelte:fragment>
			<svelte:fragment slot="content">
				<MealGroupContainer {meal} />
			</svelte:fragment>
		</AccordionItem>
	{/each}
</Accordion>
