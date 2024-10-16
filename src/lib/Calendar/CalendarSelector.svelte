<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import TileInteractiveElementWrapper from '$lib/TilesAndModals/TileInteractiveElementWrapper.svelte';
	import {
		dateIsThisWeek,
		dateIsToday,
		getNextWeekday,
		isSameDate
	} from '$lib/TSHelpers/DateHelper';

	export let disablePadding = false;
	export let selectedDate: Date = getNextWeekday();
	export let weeklySkibbers: boolean = false;

	const dispatch = createEventDispatcher();

	function dateIsInInterval(week: boolean, selectedDate: Date): boolean {
		if (week) {
			return dateIsThisWeek(selectedDate);
		}

		return isSameDate(selectedDate, getNextWeekday());
	}

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

<!-- -mb-2 hack for calendar having a bit of blank space -->
<div
	class="flex flex-row {disablePadding
		? '-mb-2'
		: 'pb-2'} space-x-1 w-full justify-between items-center"
>
	<TileInteractiveElementWrapper>
		<button
			on:click={() => handleDaySelection(false)}
			aria-label={weeklySkibbers ? 'vorherige Woche' : 'vorherige Tag'}
			class="flex-shrink-0 btn-icon variant-filled-primary size-10"
		>
			<i class="fa-solid fa-arrow-left" />
		</button>
	</TileInteractiveElementWrapper>
	<button
		on:click|stopPropagation={() => {
			if (weeklySkibbers) {
				if (!dateIsThisWeek(selectedDate)) dispatch('setToToday');
			} else {
				if (!dateIsToday(selectedDate)) dispatch('setToToday');
			}
		}}
		class="{dateIsInInterval(weeklySkibbers, selectedDate)
			? 'opacity-40 pointer-events-none'
			: ''} dont-open-modal btn-icon flex-shrink-0 bg-surface-200-700-token border border-surface-400-500-token transition-transform h-[42px] w-1/3"
	>
		<p>{weeklySkibbers ? 'Diese Woche' : 'Heute'}</p>
	</button>

	<TileInteractiveElementWrapper>
		<button
			on:click={() => handleDaySelection(true)}
			aria-label={weeklySkibbers ? 'nächste Woche' : 'nächster Tag'}
			class="flex-shrink-0 self-end btn-icon variant-filled-primary size-10"
		>
			<i class="fa-solid fa-arrow-right" />
		</button>
	</TileInteractiveElementWrapper>
</div>
