<script lang="ts">
	import { createEventDispatcher, tick } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { Mensa } from '../types';
	import { getNextWeekday } from '$lib/TSHelpers/DateHelper';

	export let mensaSelectElementValue: number | undefined = undefined;
	export let selectedMensa: Writable<number>;
	export let mensaList: Array<Mensa>;

	export let selectedDate: Date = getNextWeekday();
	const dispatch = createEventDispatcher();

	function mensalist_populated(_element: HTMLSelectElement) {
		// allegedly, svelte actions trigger once an element is created,
		// but mensaSelectElementValueDropdown is still undefined at this point sooo...
		tick().then(() => {
			mensaSelectElementValue = $selectedMensa;
		});
	}

	function changeMensa(mensaId: number | undefined) {
		if (mensaId) {
			selectedMensa.set(mensaId);
		}
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

		dispatch('dateChanged', selectedDate);
	}
</script>

<div class="flex mb-2 space-x-1 items-center">
	<button
		on:click={() => handleDaySelection(false)}
		class="btn-icon variant-filled-primary size-10"
	>
		<i class="fa-solid fa-arrow-left" />
	</button>
	<select
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
	<button on:click={() => handleDaySelection(true)} class="btn-icon variant-filled-primary size-10">
		<i class="fa-solid fa-arrow-right" />
	</button>
</div>
