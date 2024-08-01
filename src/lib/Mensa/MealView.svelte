<script lang="ts">
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import MealGroupContainer from '$lib/Mensa/MealGroupContainer.svelte';
	import type { Writable } from 'svelte/store';
	import type { MensaMeal } from '../types';

	export let expandedMealCategories: Writable<Array<string>>;
	export let mensaMeals: Array<MensaMeal>;

	function getIcon(meal_type: string) {
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
</script>

<Accordion>
	{#each mensaMeals as meal}
		<AccordionItem
			regionPanel="bg-primary-50-900"
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
				<i class="{getIcon(meal.meal_type)} scale-125"></i>
			</svelte:fragment>
			<svelte:fragment slot="summary">{meal.meal_type}</svelte:fragment>
			<svelte:fragment slot="content">
				<MealGroupContainer {meal} />
			</svelte:fragment>
		</AccordionItem>
	{/each}
	{#if mensaMeals.length === 0}
		<p class="pt-2">Keine Gerichte verfügbar.</p>
	{/if}
</Accordion>
