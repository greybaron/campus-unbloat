<script lang="ts">
	import DashboardModal from '$lib/DashboardModal.svelte';
	import MealView from '$lib/Mensa/MealView.svelte';
	import { fetchMeals } from '$lib/Mensa/MensaFuncs';
	import MensaSelector from '$lib/Mensa/MensaSelector.svelte';
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

	function showToast(payload: ToastPayload) {
		const toastSettings = getToastSettings(payload);
		toastStore.trigger(toastSettings);
	}

	$: if ($selectedMensa) handleMealsFetch($selectedMensa);
	async function handleMealsFetch(mensaId: number) {
		try {
			mensaMeals = await fetchMeals(mensaId);
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

<DashboardModal bind:parent title="Mensa">
	<svelte:fragment slot="header">
		<MensaSelector {selectedMensa} {mensaList} />
	</svelte:fragment>

	{#if mensaMeals}
		<MealView bind:expandedMealCategories {mensaMeals} />
	{/if}
</DashboardModal>
