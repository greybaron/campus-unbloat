<script lang="ts">
	import type { Writable } from 'svelte/store';

	import type { MensaMeal } from '../types';
	import MealViewAccordion from './MealViewAccordion.svelte';
	import MediaQuery from 'svelte-media-queries';

	export let twoColumn = false;
	export let expandedMealCategories: Writable<Array<string>>;
	export let mensaMeals: Array<MensaMeal>;

	let evenArray: MensaMeal[];
	let oddArray: MensaMeal[];
	$: [evenArray, oddArray] = mensaMeals.reduce<[MensaMeal[], MensaMeal[]]>(
		(acc, item, index) => (acc[index % 2].push(item), acc),
		[[], []]
	);
</script>

<!-- hacky -->
<MediaQuery query="(min-width: 640px)" let:matches>
	{#if mensaMeals.length === 0}
		<p class="pt-2">Keine Gerichte verfügbar.</p>
	{:else if twoColumn && matches && mensaMeals.length > 1}
		<div class="grid grid-cols-2 gap-3">
			<MealViewAccordion alwaysExpanded={true} mensaMeals={evenArray} {expandedMealCategories} />
			<MealViewAccordion alwaysExpanded={true} mensaMeals={oddArray} {expandedMealCategories} />
		</div>
	{:else}
		<MealViewAccordion {mensaMeals} {expandedMealCategories} />
	{/if}
</MediaQuery>
