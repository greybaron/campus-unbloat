<script lang="ts">
	import type { Writable } from 'svelte/store';

	import type { MensaMeal } from '../types';
	import MealViewAccordion from './MealViewAccordion.svelte';
	import MediaQuery from 'svelte-media-queries';

	export let twoColumn = false;
	export let expandedMealCategories: Writable<Array<string>>;
	export let mensaMeals: Array<MensaMeal>;

	const [evenArray, oddArray] = mensaMeals.reduce<[MensaMeal[], MensaMeal[]]>(
		(acc, item, index) => (acc[index % 2].push(item), acc),
		[[], []]
	);
</script>

<!-- hacky -->
<MediaQuery query="(min-width: 640px)" let:matches>
	{#if twoColumn && matches}
		<div class="grid grid-cols-2 gap-3">
			<MealViewAccordion mensaMeals={evenArray} {expandedMealCategories} />
			<MealViewAccordion mensaMeals={oddArray} {expandedMealCategories} />
		</div>
	{:else}
		<MealViewAccordion {mensaMeals} {expandedMealCategories} />
	{/if}
</MediaQuery>
