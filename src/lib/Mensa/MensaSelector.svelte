<script lang="ts">
	import { createEventDispatcher, tick } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';

	import type { Mensa } from '../types';
	import { getNextWeekday } from '$lib/TSHelpers/DateHelper';
	import OpenMensaModal from '$lib/TilesAndModals/OpenMensaModal.svelte';

	export let mensaSelectElementValue: number | undefined = undefined;
	export let selectedMensa: Writable<number>;
	export let selectedOpenMensaName: Writable<string>;
	export let mensaList: Array<Mensa>;
	export let selectedDate: Date = getNextWeekday();

	// key to reload mensalist dropdown when an "openmensa" is added to the list
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

	function mensalist_populated(_element: HTMLSelectElement) {
		// allegedly, svelte actions trigger once an element is created,
		// but mensaSelectElementValueDropdown is still undefined at this point sooo...
		tick().then(() => {
			mensaSelectElementValue = $selectedMensa;
		});
	}

	function changeMensa(mensaId: number | undefined) {
		if (mensaId === 0) {
			// sweet sentinel value which means "other mensa" was selected
			mensaSelectElementValue = $selectedMensa;
			modalStore.close();
			// start openmensa selection flow
			modalStore.trigger(openMensaModal);
		} else {
			selectedMensa.set(mensaId!);
			dispatch('selectChanged');
		}
	}

	function handleOpenMensaSelection(mensaId: number, mensaName: string) {
		const idxOldOpenMensa = mensaList.findIndex((mensa) => mensa.id < 0);
		if (idxOldOpenMensa != -1) {
			mensaList[idxOldOpenMensa] = {
				id: mensaId * -1,
				name: mensaName
			};
		} else {
			mensaList.splice(mensaList.length - 1, 0, {
				id: mensaId * -1,
				name: mensaName
			});
		}

		unique = {};

		// omfg
		selectedMensa.set(mensaId * -1);
		selectedOpenMensaName.set(mensaName);
		mensaSelectElementValue = mensaId * -1;
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
	{/key}
	<button
		aria-label="Nächster Tag"
		on:click={() => handleDaySelection(true)}
		class="flex-shrink-0 btn-icon variant-filled-primary size-10"
	>
		<i class="fa-solid fa-arrow-right" />
	</button>
</div>
