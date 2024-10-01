<script lang="ts">
	import { type SvelteComponent } from 'svelte';
	import type { Writable } from 'svelte/store';

	import DashboardModal from '$lib/DashboardModal.svelte';
	import MealView from '$lib/Mensa/MealView.svelte';
	import MensaSelector from '$lib/Mensa/MensaSelector.svelte';
	import { dateIsToday, getAltDayString } from '$lib/TSHelpers/DateHelper';
	import { type Canteen, type MealGroup } from '$lib/types';

	export let onSelectedChange: (date: Date) => Promise<MealGroup[]>;
	export let parent: SvelteComponent;
	export let canteens: Array<Canteen>;
	export let selectedCanteen: Writable<number>;
	export let selectedOpenMensaName: Writable<string>;
	export let expandedMealCategories: Writable<Array<string>>;
	export let mealGroups: Array<MealGroup> | undefined = undefined;
	export let selectedDate: Date;

	async function handleSelectChange(e: CustomEvent<Date>) {
		if (e.detail) selectedDate = e.detail;
		mealGroups = await onSelectedChange(selectedDate);
	}
</script>

<DashboardModal
	bind:parent
	title="Mensa{dateIsToday(selectedDate) ? '' : ` (${getAltDayString(selectedDate)})`}"
>
	<svelte:fragment slot="header">
		<MensaSelector
			on:selectChanged={handleSelectChange}
			{selectedCanteen}
			{selectedOpenMensaName}
			{canteens}
			{selectedDate}
		/>
	</svelte:fragment>

	{#if mealGroups}
		<MealView twoColumn={true} bind:expandedMealCategories {mealGroups} />
	{/if}
</DashboardModal>
