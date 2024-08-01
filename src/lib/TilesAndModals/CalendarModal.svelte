<script lang="ts">
	import DashboardModal from '$lib/DashboardModal.svelte';
	import Calendar from '@event-calendar/core';
	import TimeGrid from '@event-calendar/time-grid';
	import { type Writable } from 'svelte/store';
	import type { EventUnix, Event } from '$lib/types';
	import type { SvelteComponent } from 'svelte';

	export let storedEvents: Writable<EventUnix[]>;
	export let parent: SvelteComponent;

	function unixEventsToEvents(uEvents: Array<EventUnix>): Array<Event> {
		let events: Event[] = [];

		uEvents.forEach((event) => {
			events.push({
				start: new Date(event.start),
				end: new Date(event.end),
				title: event.title,
				textColor: event.textColor,
				instructor: event.instructor,
				room: event.room,
				remarks: event.remarks,
				color: event.color
			});
		});

		return events;
	}

	function getNextMonday(date = new Date()) {
		const day = date.getDay();
		const diff = day === 6 ? 2 : day === 0 ? 1 : 0; // 6 = Samstag, 0 = Sonntag
		if (diff > 0) {
			date.setDate(date.getDate() + diff);
		}
		return date;
	}

	let eventList: Event[] = [];

	let plugins = [TimeGrid];
	let options = {
		view: 'timeGridWeek',
		date: getNextMonday(),
		events: eventList,
		firstDay: 1,
		hiddenDays: [0, 6],
		allDaySlot: false,
		slotMinTime: '07:30:00',
		slotMaxTime: '18:00:00',
		slotWidth: 60
	};

	$: $storedEvents, run(unixEventsToEvents($storedEvents));

	function run(events: Event[]) {
		if (events) {
			options.events = events;
		}
	}
</script>

<DashboardModal bind:parent title="Kalender">
	<Calendar {plugins} {options} />
</DashboardModal>
