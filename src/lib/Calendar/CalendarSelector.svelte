<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { dateIsToday, getNextWeekday } from '$lib/TSHelpers/DateHelper';
	import { type EventUnix } from '$lib/types';
	import { persistentStore } from '$lib/TSHelpers/LocalStorageHelper';
	import type { Writable } from 'svelte/store';

	export let selectedDate: Date = getNextWeekday();

	const dispatch = createEventDispatcher();

	let storedEventsUnix: Writable<EventUnix[]>;
    storedEventsUnix = persistentStore('storedEvents', []);

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
	<div class="flex flex-row mb-2 space-x-1 w-full justify-between ">
		<button
			on:click={() => handleDaySelection(false)}
			class="flex-shrink-0 btn-icon variant-filled-primary size-10"
		>
			<i class="fa-solid fa-arrow-left" />
		</button>
		{#if dateIsToday(selectedDate)}
		<button
			class="opacity-40 btn-icon flex-shrink-0 bg-surface-200-700-token border border-surface-400-500-token transition-transform size-10 w-1/3"
		>
			<p>Heute</p>
		</button>
		{:else}
		<button
			on:click={() => dispatch('setToToday')}
			class="btn-icon flex-shrink-0 bg-surface-200-700-token border border-surface-400-500-token transition-transform size-10 w-1/3"
		>
			<p>Heute</p>
		</button>
		{/if}
		<button
			on:click={() => handleDaySelection(true)}
			class="flex-shrink-0 self-end btn-icon variant-filled-primary size-10"
		>
			<i class="fa-solid fa-arrow-right" />
		</button>
</div>
