<script lang="ts">
	import DashboardModal from '$lib/DashboardModal.svelte';
	import Calendar from '@event-calendar/core';
	import TimeGrid from '@event-calendar/time-grid';

	interface Event {
		start: Date;
		end: Date;
		title: string;
		backgroundColor: string;
		textColor: string;
	}

	function getNextMonday(date = new Date()) {
		const day = date.getDay();
		const diff = day === 6 ? 2 : day === 0 ? 1 : 0; // 6 = Samstag, 0 = Sonntag
		if (diff > 0) {
			date.setDate(date.getDate() + diff);
		}
		return date;
	}

	export let stats: Event[];

	let plugins = [TimeGrid];
	let options = {
		view: 'timeGridWeek',
		date: getNextMonday(),
		events: stats,
		firstDay: 1,
		hiddenDays: [0, 6],
		allDaySlot: false,
		slotMinTime: '07:30:00',
		slotMaxTime: '18:00:00',
		slotWidth: 60
	};
</script>

<DashboardModal title="Kalender">
	<svelte:fragment slot="body">
		<Calendar {plugins} {options} />
	</svelte:fragment>
	<svelte:fragment slot="optionalbuttons"></svelte:fragment>
</DashboardModal>
