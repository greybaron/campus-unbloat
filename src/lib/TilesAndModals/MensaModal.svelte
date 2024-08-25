<script lang="ts">
	import { type SvelteComponent } from 'svelte';
	import type { Writable } from 'svelte/store';

	import DashboardModal from '$lib/DashboardModal.svelte';
	import MealView from '$lib/Mensa/MealView.svelte';
	import MensaSelector from '$lib/Mensa/MensaSelector.svelte';
	import { dateIsToday, getAltDayString } from '$lib/TSHelpers/DateHelper';
	import { type Mensa, type MensaMeal } from '$lib/types';

	export let onSelectedChange: (date: Date) => Promise<MensaMeal[]>;
	export let parent: SvelteComponent;
	export let mensaList: Array<Mensa>;
	export let selectedMensa: Writable<number>;
	export let expandedMealCategories: Writable<Array<string>>;
	export let mensaMeals: Array<MensaMeal> | undefined = undefined;
	export let selectedDate: Date;

	async function handleSelectChange(e: CustomEvent<Date>) {
		if (e.detail) selectedDate = e.detail;
		mensaMeals = await onSelectedChange(selectedDate);
	}
</script>

<DashboardModal
	bind:parent
	title="Mensa{dateIsToday(selectedDate) ? '' : ` (${getAltDayString(selectedDate)})`}"
>
	<svelte:fragment slot="header">
		<MensaSelector
			on:selectChanged={handleSelectChange}
			{selectedMensa}
			{mensaList}
			{selectedDate}
		/>
	</svelte:fragment>

	{#if mensaMeals}
		<MealView bind:expandedMealCategories {mensaMeals} />
	{/if}
</DashboardModal>
