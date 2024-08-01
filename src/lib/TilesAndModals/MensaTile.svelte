<script lang="ts">
	import DashboardTile from '$lib/DashboardTile.svelte';
	import { onMount, SvelteComponent } from 'svelte';
	import { persistentStore } from '$lib/TSHelpers/LocalStorageHelper';

	import MensaModal from './MensaModal.svelte';
	import {
		getModalStore,
		SlideToggle,
		type ModalComponent,
		type ModalSettings
	} from '@skeletonlabs/skeleton';

	import TileInteractiveElementWrapper from '$lib/TileInteractiveElementWrapper.svelte';
	import type { Writable } from 'svelte/store';
	import { createEventDispatcher } from 'svelte';
	import { ToastPayloadClass, type Mensa, type MensaMeal, type ToastPayload } from '$lib/types';
	import MealView from '$lib/Mensa/MealView.svelte';
	import MensaSelector from '$lib/Mensa/MensaSelector.svelte';
	import { fetchMeals } from '$lib/Mensa/MensaFuncs';
	const dispatch = createEventDispatcher();

	let modalStore = getModalStore();
	let modalComponent: ModalComponent;
	let modal: ModalSettings;

	let mensaList: Array<Mensa>;
	let mensaMeals: Array<MensaMeal> | undefined;

	let mensaSelectElementValue: number; // = 140;;

	let showMealsInTile: Writable<boolean>;
	let expandedMealCategories: Writable<Array<string>>;
	let selectedMensa: Writable<number>;

	let mensaSelectorComponent: SvelteComponent;

	onMount(async () => {
		console.log('Fetching mensalist...');
		const res = await fetch('/api/mensalist');

		if (!res.ok) {
			let error = await res.text();
			let payload: ToastPayload = {
				text: error,
				class: ToastPayloadClass.error
			};

			dispatch('showToast', payload);
			return;
		}

		mensaList = await res.json();

		showMealsInTile = persistentStore('showMealsInTile', false);
		expandedMealCategories = persistentStore('expandedMealCategories', []);
		selectedMensa = persistentStore('selectedMensa', mensaList[0].id);

		modalComponent = {
			ref: MensaModal,
			props: {
				mensaList: mensaList,
				expandedMealCategories: expandedMealCategories,
				selectedMensa: selectedMensa
			}
		};

		modal = {
			type: 'component',
			component: modalComponent
		};
	});

	$: if ($selectedMensa) handleMealsFetch($selectedMensa);

	async function handleMealsFetch(mensaId: number) {
		mensaSelectElementValue = mensaId;

		if (mensaSelectorComponent) {
			mensaSelectorComponent.setMensaSelected(mensaId);
		}

		try {
			mensaMeals = await fetchMeals(mensaId);
			modalComponent.props!.mensaMeals = mensaMeals;
		} catch (e) {
			if (e instanceof Error) {
				let payload: ToastPayload = {
					text: e.message,
					class: ToastPayloadClass.error
				};

				dispatch('showToast', payload);
			}
		}
	}
</script>

<DashboardTile
	title="Mensa"
	on:click={() => {
		modalStore.trigger(modal);
	}}
	ready={Boolean(mensaList)}
>
	<div class="flex flex-col items-stretch space-y-2 w-full">
		{#if !$showMealsInTile}
			<p class="pt-4 my-auto text-md font-bold">Klicken, um alle Mensen anzuzeigen.</p>
		{/if}
		<TileInteractiveElementWrapper>
			{#if $showMealsInTile && mensaList}
				<MensaSelector bind:mensaSelectElementValue {selectedMensa} {mensaList} />
			{/if}

			{#if $showMealsInTile && mensaMeals}
				<MealView bind:expandedMealCategories {mensaMeals} />
			{/if}

			<button>
				<SlideToggle
					class="pt-3"
					size="sm"
					active="bg-primary-500"
					name="slide"
					bind:checked={$showMealsInTile}>Gerichte auch hier anzeigen</SlideToggle
				>
			</button>
		</TileInteractiveElementWrapper>
	</div>
</DashboardTile>
