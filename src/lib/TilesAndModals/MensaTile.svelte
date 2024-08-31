<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import {
		getModalStore,
		SlideToggle,
		type ModalComponent,
		type ModalSettings
	} from '@skeletonlabs/skeleton';
	import type { Writable } from 'svelte/store';

	import { ToastPayloadClass, type Mensa, type MensaMeal, type ToastPayload } from '$lib/types';
	import MensaModal from './MensaModal.svelte';
	import DashboardTile from '$lib/DashboardTile.svelte';
	import { persistentStore } from '$lib/TSHelpers/LocalStorageHelper';
	import TileInteractiveElementWrapper from '$lib/TilesAndModals/TileInteractiveElementWrapper.svelte';
	import MealView from '$lib/Mensa/MealView.svelte';
	import MensaSelector from '$lib/Mensa/MensaSelector.svelte';
	import { fetchMeals, fetchOpenMeals } from '$lib/Mensa/MensaFuncs';
	import { dateIsToday, getAltDayString, getNextWeekday } from '$lib/TSHelpers/DateHelper';

	const dispatch = createEventDispatcher();

	let modalStore = getModalStore();
	let modalComponent: ModalComponent;
	let modal: ModalSettings;

	let mensaList: Array<Mensa>;
	let mensaSelectElementValue: number;
	let mensaMeals: Array<MensaMeal> | undefined;

	let showMealsInTile: Writable<boolean>;
	let expandedMealCategories: Writable<Array<string>>;
	let selectedMensa: Writable<number>;
	let selectedOpenMensaName: Writable<string>;

	let selectedDate: Date = getNextWeekday();
	let unique = {};

	onMount(async () => {
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

		showMealsInTile = persistentStore('showMealsInTile', true);
		expandedMealCategories = persistentStore('expandedMealCategories', []);
		selectedMensa = persistentStore('selectedMensa', mensaList[0].id);
		selectedOpenMensaName = persistentStore('selectedOpenMensaName', '');

		if ($selectedMensa < 0) {
			mensaList.push({ id: $selectedMensa, name: $selectedOpenMensaName });
		}
		mensaList.push({
			id: 0,
			name: 'Andere Mensa...'
		});

		handleMealsFetch();

		modalComponent = {
			ref: MensaModal,
			props: {
				mensaList: mensaList,
				expandedMealCategories: expandedMealCategories,
				selectedMensa: selectedMensa,
				selectedOpenMensaName: selectedOpenMensaName,
				selectedDate: selectedDate,
				onSelectedChange: handleModalSelectChange
			}
		};

		modal = {
			type: 'component',
			component: modalComponent
		};
	});

	async function handleMealsFetch(): Promise<MensaMeal[] | undefined> {
		try {
			if ($selectedMensa > 0) {
				mensaMeals = await fetchMeals(selectedDate, $selectedMensa);
				modalComponent.props!.mensaMeals = mensaMeals;
				return mensaMeals;
			} else {
				mensaMeals = await fetchOpenMeals(selectedDate, $selectedMensa * -1);
				modalComponent.props!.mensaMeals = mensaMeals;
				return mensaMeals;
			}
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

	function handleSelectChange(e: CustomEvent<Date>) {
		if (e.detail) {
			selectedDate = e.detail;
			modalComponent.props!.selectedDate = selectedDate;
		}

		handleMealsFetch();
	}

	async function handleModalSelectChange(date: Date): Promise<MensaMeal[]> {
		selectedDate = date;
		await handleMealsFetch();
		// dont care
		if ($selectedMensa < 0) {
			unique = {};
		}
		return mensaMeals!;
	}
</script>

<DashboardTile
	title="Mensa{dateIsToday(selectedDate) ? '' : ` (${getAltDayString(selectedDate)})`}"
	on:click={() => {
		modalStore.trigger(modal);
	}}
	ready={Boolean(mensaList)}
>
	<svelte:fragment slot="header">
		{#if $showMealsInTile && mensaList}
			<TileInteractiveElementWrapper add_class="w-full">
				{#key unique}
					<MensaSelector
						on:selectChanged={handleSelectChange}
						bind:mensaSelectElementValue
						{selectedMensa}
						{selectedOpenMensaName}
						{mensaList}
					/>
				{/key}
			</TileInteractiveElementWrapper>
		{/if}
	</svelte:fragment>
	<svelte:fragment slot="footer">
		<SlideToggle
			class="pt-3"
			size="sm"
			active="bg-primary-500"
			name="slide"
			bind:checked={$showMealsInTile}>Gerichte auch hier anzeigen</SlideToggle
		>
	</svelte:fragment>

	<div class="flex flex-col space-y-2 w-full">
		{#if !$showMealsInTile}
			<p class="pt-4 my-auto text-md font-bold">Klicken, um alle Mensen anzuzeigen.</p>
		{/if}
		<TileInteractiveElementWrapper>
			{#if $showMealsInTile && mensaMeals}
				<MealView bind:expandedMealCategories {mensaMeals} />
			{/if}
		</TileInteractiveElementWrapper>
	</div>
</DashboardTile>
