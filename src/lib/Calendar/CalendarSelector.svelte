<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { dateIsThisWeek, dateIsToday, getNextWeekday } from '$lib/TSHelpers/DateHelper';
	import TileInteractiveElementWrapper from '$lib/TileInteractiveElementWrapper.svelte';

	export let selectedDate: Date = getNextWeekday();
	export let weeklySkibbers: boolean = false;

	const dispatch = createEventDispatcher();

	function handleDaySelection(forward: boolean) {
		if (weeklySkibbers) {
			if (forward) {
				selectedDate.setTime(selectedDate.getTime() + 1000 * 60 * 60 * 24 * 7);
			} else {
				selectedDate.setTime(selectedDate.getTime() - 1000 * 60 * 60 * 24 * 7);
			}
		} else {
			const day = selectedDate.getDay();
			let delta: number;

			if (forward) {
				delta = day === 5 ? 3 : day === 6 ? 2 : 1;
			} else {
				delta = day === 1 ? -3 : day === 0 ? -2 : -1;
			}

			selectedDate.setDate(selectedDate.getDate() + delta);
		}

		dispatch('dateChanged', selectedDate);
	}
</script>

<div class="flex flex-row mb-2 space-x-1 w-full justify-between">
	<TileInteractiveElementWrapper>
		<button
			on:click={() => handleDaySelection(false)}
			class="flex-shrink-0 btn-icon variant-filled-primary size-10"
		>
			<i class="fa-solid fa-arrow-left" />
		</button>
	</TileInteractiveElementWrapper>
	{#if weeklySkibbers}
		<button
			on:click|stopPropagation={() => {
				if (!dateIsThisWeek(selectedDate)) dispatch('setToToday');
			}}
			class="{dateIsThisWeek(selectedDate)
				? 'opacity-40 pointer-events-none'
				: ''} btn-icon flex-shrink-0 bg-surface-200-700-token border border-surface-400-500-token transition-transform size-10 w-1/3"
		>
			<p>Diese Woche</p>
		</button>
	{:else}
		<button
			on:click|stopPropagation={() => {
				if (!dateIsToday(selectedDate)) dispatch('setToToday');
			}}
			class="{dateIsToday(selectedDate)
				? 'opacity-40 pointer-events-none'
				: ''} btn-icon flex-shrink-0 bg-surface-200-700-token border border-surface-400-500-token transition-transform size-10 w-1/3"
		>
			<p>Heute</p>
		</button>
	{/if}

	<TileInteractiveElementWrapper>
		<button
			on:click={() => handleDaySelection(true)}
			class="flex-shrink-0 self-end btn-icon variant-filled-primary size-10"
		>
			<i class="fa-solid fa-arrow-right" />
		</button>
	</TileInteractiveElementWrapper>
</div>
