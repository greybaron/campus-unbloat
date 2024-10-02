<script lang="ts">
	import { createEventDispatcher, tick } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';

	import type { Canteen } from '../types';
	import { getNextWeekday } from '$lib/TSHelpers/DateHelper';
	import OpenMensaModal from '$lib/TilesAndModals/OpenMensaModal.svelte';

	export let canteenSelectListValue: number | undefined = undefined;
	export let selectedCanteen: Writable<number>;
	export let selectedOpenMensaName: Writable<string>;
	export let canteens: Array<Canteen>;
	export let selectedDate: Date = getNextWeekday();

	// key to reload canteens dropdown when an "openmensa" canteen is added to the list
	let unique = {};

	const dispatch = createEventDispatcher();
	const modalStore = getModalStore();

	let openmensaModalComponent: ModalComponent;
	let openMensaModal: ModalSettings;

	openmensaModalComponent = {
		ref: OpenMensaModal,
		props: {
			onOpenMensaSelection: handleOpenMensaSelection
		}
	};

	openMensaModal = {
		type: 'component',
		component: openmensaModalComponent
	};

	function canteens_populated(_element: HTMLSelectElement) {
		// allegedly, svelte actions trigger once an element is created,
		// but canteenSelectListValueDropdown is still undefined at this point sooo...
		tick().then(() => {
			canteenSelectListValue = $selectedCanteen;
		});
	}

	function changeCanteen(canteenId: number | undefined) {
		if (canteenId === 0) {
			// sweet sentinel value which means "other mensa" was selected
			canteenSelectListValue = $selectedCanteen;
			modalStore.close();
			// start openmensa selection flow
			modalStore.trigger(openMensaModal);
		} else {
			selectedCanteen.set(canteenId!);
			dispatch('selectChanged');
		}
	}

	function handleOpenMensaSelection(canteenId: number, canteenName: string) {
		const idxOldOpenMensa = canteens.findIndex((canteen) => canteen.id < 0);
		if (idxOldOpenMensa != -1) {
			canteens[idxOldOpenMensa] = {
				id: canteenId * -1,
				name: canteenName
			};
		} else {
			canteens.splice(canteens.length - 1, 0, {
				id: canteenId * -1,
				name: canteenName
			});
		}

		unique = {};

		// omfg
		selectedCanteen.set(canteenId * -1);
		selectedOpenMensaName.set(canteenName);
		canteenSelectListValue = canteenId * -1;
		dispatch('selectChanged');
	}

	function handleDaySelection(forward: boolean) {
		const day = selectedDate.getDay();
		let delta: number;

		if (forward) {
			delta = day === 5 ? 3 : day === 6 ? 2 : 1;
		} else {
			delta = day === 1 ? -3 : day === 0 ? -2 : -1;
		}

		selectedDate.setDate(selectedDate.getDate() + delta);
		dispatch('selectChanged', selectedDate);
	}
</script>

<div class="flex mb-2 space-x-1 items-center w-full">
	<button
		aria-label="Vorheriger Tag"
		on:click={() => handleDaySelection(false)}
		class="flex-shrink-0 btn-icon variant-filled-primary size-10"
	>
		<i class="fa-solid fa-arrow-left" />
	</button>
	{#key unique}
		<select
			aria-label="Mensa auswählen"
			class="select transition-none"
			bind:value={canteenSelectListValue}
			on:change={() => {
				changeCanteen(canteenSelectListValue);
			}}
			use:canteens_populated
		>
			{#each canteens as canteen}
				<option value={canteen.id}>{canteen.name}</option>
			{/each}
		</select>
	{/key}
	<button
		aria-label="Nächster Tag"
		on:click={() => handleDaySelection(true)}
		class="flex-shrink-0 btn-icon variant-filled-primary size-10"
	>
		<i class="fa-solid fa-arrow-right" />
	</button>
</div>
