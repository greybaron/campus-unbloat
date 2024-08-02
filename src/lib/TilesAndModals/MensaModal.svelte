<script lang="ts">
	import DashboardModal from '$lib/DashboardModal.svelte';
	import MealView from '$lib/Mensa/MealView.svelte';
	import { fetchMeals } from '$lib/Mensa/MensaFuncs';
	import MensaSelector from '$lib/Mensa/MensaSelector.svelte';
	import { dateIsToday, getAltDayString } from '$lib/TSHelpers/DateHelper';
	import {
		getToastSettings,
		ToastPayloadClass,
		type Mensa,
		type MensaMeal,
		type ToastPayload
	} from '$lib/types';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { type SvelteComponent } from 'svelte';
	import type { Writable } from 'svelte/store';
	export let parent: SvelteComponent;
	const toastStore = getToastStore();

	export let mensaList: Array<Mensa>;
	export let selectedMensa: Writable<number>;
	export let expandedMealCategories: Writable<Array<string>>;
	export let mensaMeals: Array<MensaMeal> | undefined = undefined;
	export let selectedDate: Date;

	function showToast(payload: ToastPayload) {
		const toastSettings = getToastSettings(payload);
		toastStore.trigger(toastSettings);
	}

	function handleSelectedDateChange(e: CustomEvent<Date>) {
		selectedDate = e.detail;
	}

	$: if ($selectedMensa && selectedDate) handleMealsFetch($selectedMensa);
	async function handleMealsFetch(mensaId: number) {
		try {
			mensaMeals = await fetchMeals(selectedDate, mensaId);
		} catch (e) {
			if (e instanceof Error) {
				let payload: ToastPayload = {
					text: e.message,
					class: ToastPayloadClass.error
				};

				showToast(payload);
			}
		}
	}
</script>

<DashboardModal
	bind:parent
	title="Mensa{dateIsToday(selectedDate) ? '' : ` (${getAltDayString(selectedDate)})`}"
>
	<svelte:fragment slot="header">
		<MensaSelector
			on:dateChanged={handleSelectedDateChange}
			{selectedMensa}
			{mensaList}
			{selectedDate}
		/>
	</svelte:fragment>

	{#if mensaMeals}
		<MealView bind:expandedMealCategories {mensaMeals} />
	{/if}
</DashboardModal>
