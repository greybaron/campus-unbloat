<script lang="ts">
	import type { Writable } from 'svelte/store';

	import type { MealGroup } from '../types';
	import MealViewAccordion from './MealViewAccordion.svelte';
	import MediaQuery from 'svelte-media-queries';

	export let twoColumn = false;
	export let expandedMealCategories: Writable<Array<string>>;
	export let mealGroups: Array<MealGroup>;

	let evenArray: MealGroup[];
	let oddArray: MealGroup[];
	$: [evenArray, oddArray] = mealGroups.reduce<[MealGroup[], MealGroup[]]>(
		(acc, item, index) => (acc[index % 2].push(item), acc),
		[[], []]
	);
</script>

<!-- hacky -->
<MediaQuery query="(min-width: 640px)" let:matches>
	{#if mealGroups.length === 0}
		<p class="pt-2">Keine Gerichte verfügbar.</p>
	{:else if twoColumn && matches && mealGroups.length > 1}
		<div class="grid grid-cols-2 gap-3">
			<MealViewAccordion alwaysExpanded={true} mealGroups={evenArray} {expandedMealCategories} />
			<MealViewAccordion alwaysExpanded={true} mealGroups={oddArray} {expandedMealCategories} />
		</div>
	{:else}
		<MealViewAccordion {mealGroups} {expandedMealCategories} />
	{/if}
</MediaQuery>
