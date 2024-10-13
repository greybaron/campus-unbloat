<script lang="ts">
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import type { Writable } from 'svelte/store';
	import { createEventDispatcher } from 'svelte';

	import type { MealGroup } from '$lib/types';
	import MealGroupContainer from './MealGroupContainer.svelte';

	export let alwaysExpanded = false;
	export let mealGroups: MealGroup[];
	export let expandedMealCategories: Writable<Array<string>>;

	const dispatch = createEventDispatcher();

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

		return 'bg-white/60 dark:bg-surface-700';
	}

	function getGroupGradientColour(meal_type: string): string | undefined {
		const icons: { [key: string]: string } = {
			vegan: 'from-green-400/30',
			vegetarisch: 'from-green-400/30',
			gemüse: 'from-green-400/30',
			fleisch: 'from-red-400/30',
			fisch: 'from-blue-400/30',
			pastateller: 'from-yellow-300/30'
		};

		const lowercasedMealType = meal_type.toLowerCase();

		for (const key in icons) {
			if (lowercasedMealType.includes(key)) {
				return icons[key];
			}
		}
	}
</script>

<Accordion>
	{#each mealGroups as mealGroup}
		<AccordionItem
			hover="hover:dark:backdrop-brightness-200 hover:backdrop-brightness-90 transition-[backdrop-filter]"
			regionControl="{getGroupColour(
				mealGroup.meal_type
			)} border border-surface-400-500-token {alwaysExpanded ? 'pointer-events-none' : ''}"
			regionCaret={alwaysExpanded ? 'hidden' : ''}
			open={alwaysExpanded || $expandedMealCategories.includes(mealGroup.meal_type)}
			on:toggle={(e) => {
				expandedMealCategories.update((categories) => {
					if (e.detail.open) {
						return [...categories, mealGroup.meal_type];
					} else {
						return categories.filter((cat) => cat !== mealGroup.meal_type);
					}
				});
			}}
		>
			<svelte:fragment slot="lead">
				<i class="{getGroupIcon(mealGroup.meal_type)} scale-125"></i>
			</svelte:fragment>
			<svelte:fragment slot="summary">{mealGroup.meal_type}</svelte:fragment>
			<svelte:fragment slot="content">
				<MealGroupContainer
					on:click={() => dispatch('mealGroupClicked')}
					{mealGroup}
					gradientColour={getGroupGradientColour(mealGroup.meal_type)}
				/>
			</svelte:fragment>
		</AccordionItem>
	{/each}
</Accordion>
