<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import {
		getModalStore,
		SlideToggle,
		type ModalComponent,
		type ModalSettings
	} from '@skeletonlabs/skeleton';
	import type { Writable } from 'svelte/store';

	import { ToastPayloadClass, type Canteen, type MealGroup, type ToastPayload } from '$lib/types';
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

	let canteens: Array<Canteen>;
	let canteenSelectListValue: number;
	let mealGroups: Array<MealGroup> | undefined;

	let showMealsInTile: Writable<boolean>;
	let expandedMealCategories: Writable<Array<string>>;
	let selectedCanteen: Writable<number>;
	let selectedOpenMensaName: Writable<string>;

	let selectedDate: Date = getNextWeekday();
	let unique = {};

	onMount(async () => {
		const res = await fetch('/api/mensa/canteens');

		if (!res.ok) {
			let error = await res.text();
			let payload: ToastPayload = {
				text: error,
				class: ToastPayloadClass.error
			};

			dispatch('showToast', payload);
			return;
		}

		canteens = await res.json();

		showMealsInTile = persistentStore('showMealsInTile', true);
		expandedMealCategories = persistentStore('expandedMealCategories', []);
		selectedCanteen = persistentStore('selectedCanteen', canteens[0].id);
		selectedOpenMensaName = persistentStore('selectedOpenMensaName', '');

		if ($selectedCanteen < 0) {
			canteens.push({ id: $selectedCanteen, name: $selectedOpenMensaName });
		}
		canteens.push({
			id: 0,
			name: 'Andere Mensa...'
		});

		handleMealsFetch();

		modalComponent = {
			ref: MensaModal,
			props: {
				canteens: canteens,
				expandedMealCategories: expandedMealCategories,
				selectedCanteen: selectedCanteen,
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

	async function handleMealsFetch(): Promise<MealGroup[] | undefined> {
		try {
			if ($selectedCanteen > 0) {
				mealGroups = await fetchMeals(selectedDate, $selectedCanteen);
				modalComponent.props!.mealGroups = mealGroups;
				return mealGroups;
			} else {
				mealGroups = await fetchOpenMeals(selectedDate, $selectedCanteen * -1);
				modalComponent.props!.mealGroups = mealGroups;
				return mealGroups;
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

	async function handleModalSelectChange(date: Date): Promise<MealGroup[]> {
		selectedDate = date;
		await handleMealsFetch();
		// dont care
		if ($selectedCanteen < 0) {
			unique = {};
		}
		return mealGroups!;
	}
</script>

<DashboardTile
	title="Mensa{dateIsToday(selectedDate) ? '' : ` (${getAltDayString(selectedDate)})`}"
	on:click={() => {
		modalStore.trigger(modal);
	}}
	ready={Boolean(canteens)}
>
	<svelte:fragment slot="header">
		{#if $showMealsInTile && canteens}
			<TileInteractiveElementWrapper add_class="w-full">
				{#key unique}
					<MensaSelector
						on:selectChanged={handleSelectChange}
						bind:canteenSelectListValue
						{selectedCanteen}
						{selectedOpenMensaName}
						{canteens}
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
			{#if $showMealsInTile && mealGroups}
				<MealView
					bind:expandedMealCategories
					{mealGroups}
					on:mealGroupClicked={() => modalStore.trigger(modal)}
				/>
			{/if}
		</TileInteractiveElementWrapper>
	</div>
</DashboardTile>
