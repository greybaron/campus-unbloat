<script lang="ts">
	import DashboardTile from '$lib/DashboardTile.svelte';
	import { onMount, tick } from 'svelte';
	import { persistentStore } from '$lib/LocalStorageHelper';
	import { browser } from '$app/environment';

	import MensiModal from './MensiModal.svelte';
	import {
		Accordion,
		AccordionItem,
		getModalStore,
		SlideToggle,
		type ModalComponent,
		type ModalSettings
	} from '@skeletonlabs/skeleton';
	import MealContainer from '$lib/MealContainer.svelte';
	import TileInteractiveElementWrapper from '$lib/TileInteractiveElementWrapper.svelte';
	import type { Writable } from 'svelte/store';

	let modalStore = getModalStore();
	let modalComponent: ModalComponent;
	let modal: ModalSettings;

	let mensaList: Array<{
		id: number;
		name: string;
	}>;

	type mensaMealsType =
		| Array<{
				meal_type: string;
				sub_meals: mensaSubMeals;
		  }>
		| undefined;

	type mensaSubMeals = Array<{
		name: string;
		additional_ingredients: Array<string>;
		price: string;
	}>;

	let mensaMeals: mensaMealsType;
	let mensaSelectElementValue: number; // = 140;;

	let showMealsInTile: Writable<boolean>;
	let expandedMealCategories: Writable<Array<string>>;
	let selectedMensa: Writable<number>;

	onMount(async () => {
		console.log('Fetching mensalist...');
		const res = await fetch('/api/mensalist');

		if (!res.ok) {
			return { props: { error: res.status } };
		}

		mensaList = await res.json();

		showMealsInTile = persistentStore('showMealsInTile', false);
		expandedMealCategories = persistentStore('expandedMealCategories', []);
		selectedMensa = persistentStore('selectedMensa', mensaList[0].id);

		modalComponent = {
			ref: MensiModal,
			props: { mensaList: mensaList }
		};

		modal = {
			type: 'component',
			component: modalComponent
		};
	});

	// called
	function mensalist_populated(_element: HTMLSelectElement) {
		// allegedly, svelte actions trigger once an element is created,
		// but mensaSelectElementValueDropdown is still undefined at this point sooo...
		tick().then(() => {
			mensaSelectElementValue = $selectedMensa;
			fetchMealsWrapper(mensaSelectElementValue);
		});
	}

	function changeMensa(mensaId: number) {
		selectedMensa.set(mensaId);
		fetchMealsWrapper(mensaId);
	}

	function getFormattedDate(date: Date): string {
		const year = date.getFullYear();
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const day = date.getDate().toString().padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	function getNextMonday(date: Date): Date {
		const day = date.getDay();
		const daysToAdd = day === 0 ? 1 : 7 - day + 1;
		date.setDate(date.getDate() + daysToAdd);
		return date;
	}

	function getCurrentOrNextMondayDate(): string {
		const today = new Date();
		const day = today.getDay();

		if (day === 6 || day === 0) {
			// Saturday or Sunday
			return getFormattedDate(getNextMonday(today));
		}

		return getFormattedDate(today);
	}

	function fetchMealsWrapper(mensaId: number) {
		if (browser) {
			fetchMeals(mensaId).then((meals) => {
				mensaMeals = meals;
			});
		}
	}

	async function fetchMeals(mensaId: number): Promise<mensaMealsType> {
		console.log('fetch meals for', mensaId);
		let date = getCurrentOrNextMondayDate();
		const res = await fetch(`/api/get_day_at_mensa/?mensa=${mensaId}&date=${date}`);

		if (res.ok) {
			return res.json();
		}
	}

	function getIcon(meal_type: string) {
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
</script>

<DashboardTile
	title="Mensa"
	on:click={() => {
		modalStore.trigger(modal);
	}}
	ready={Boolean(mensaList)}
>
	<svelte:fragment slot="body">
		<div class="flex flex-col items-stretch space-y-2 w-full">
			{#if !$showMealsInTile}
				<p class="pt-4 pb-2 my-auto text-md font-bold">Klicken, um alle Mensen anzuzeigen.</p>
			{/if}
			<TileInteractiveElementWrapper>
				{#if $showMealsInTile && mensaList}
					<select
						class="select mb-2"
						bind:value={mensaSelectElementValue}
						on:change={() => {
							changeMensa(mensaSelectElementValue);
						}}
						use:mensalist_populated
					>
						{#each mensaList as mensa}
							<option value={mensa.id}>{mensa.name}</option>
						{/each}
					</select>
				{/if}

				{#if $showMealsInTile && mensaMeals}
					<Accordion>
						{#each mensaMeals as meal}
							<AccordionItem
								regionPanel="bg-primary-50-900"
								open={$expandedMealCategories.includes(meal.meal_type)}
								on:toggle={(e) => {
									expandedMealCategories.update((categories) => {
										if (e.detail.open) {
											return [...categories, meal.meal_type];
										} else {
											return categories.filter((cat) => cat !== meal.meal_type);
										}
									});
								}}
							>
								<svelte:fragment slot="lead">
									<i class="{getIcon(meal.meal_type)} scale-125"></i>
								</svelte:fragment>
								<svelte:fragment slot="summary">{meal.meal_type}</svelte:fragment>
								<svelte:fragment slot="content">
									<MealContainer {meal} />
								</svelte:fragment>
							</AccordionItem>
						{/each}
						{#if mensaMeals.length === 0}
							<p class="pt-2">Keine Gerichte verfügbar.</p>
						{/if}
					</Accordion>
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
	</svelte:fragment>
</DashboardTile>
