<script lang="ts">
	import DashboardModal from '$lib/DashboardModal.svelte';
	import Calendar from '@event-calendar/core';
	import TimeGrid from '@event-calendar/time-grid';
	import { onMount } from 'svelte';
	import { writable, type Writable } from 'svelte/store';

	interface Event {
		start: Date;
		end: Date;
		title: string;
		backgroundColor: string;
		textColor: string;
	}

	function persistentStore(key: string) {
		const storedValue = localStorage.getItem(key);
		const initialValue = storedValue ? JSON.parse(storedValue) : [];
		const store = writable(initialValue);

		store.subscribe((value) => {
			localStorage.setItem(key, JSON.stringify(value));
		});

		return store;
	}

	function getNextMonday(date = new Date()) {
		const day = date.getDay();
		const diff = day === 6 ? 2 : day === 0 ? 1 : 0; // 6 = Samstag, 0 = Sonntag
		if (diff > 0) {
			date.setDate(date.getDate() + diff);
		}
		return date;
	}

	function convertToBerlinTime(dateUTC: Date): Date {
	    const options: Intl.DateTimeFormatOptions = {
	        timeZone: 'Europe/Berlin',
	        year: 'numeric', month: 'numeric', day: 'numeric',
	        hour: 'numeric', minute: 'numeric', second: 'numeric',
	        hour12: false
	    };

	    const formatter = new Intl.DateTimeFormat('de-DE', options);
	    const parts = formatter.formatToParts(dateUTC);

	    const year = parseInt(parts.find(p => p.type === 'year')?.value || '0', 10);
    	const month = parseInt(parts.find(p => p.type === 'month')?.value || '0', 10) - 1; // Monate sind 0-basiert
    	const day = parseInt(parts.find(p => p.type === 'day')?.value || '0', 10);
    	const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '0', 10);
    	const minute = parseInt(parts.find(p => p.type === 'minute')?.value || '0', 10);
    	const second = parseInt(parts.find(p => p.type === 'second')?.value || '0', 10);

	    return new Date(year, month, day, hour, minute, second);
	}

	let eventList: Event[] = [];
	let storedEvents: Writable<Event[]>;

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

	onMount(async () => {
		storedEvents = persistentStore('storedEvents');
		eventList = [];

		$storedEvents.forEach((e) => {
    		e.start = convertToBerlinTime(new Date(e.start));
    		e.end = convertToBerlinTime(new Date(e.end));
		});

		eventList = $storedEvents;
		options.events = $storedEvents;
	});
</script>

<DashboardModal title="Kalender">
	<svelte:fragment slot="body">
		<Calendar {plugins} {options} />
	</svelte:fragment>
	<svelte:fragment slot="optionalbuttons"></svelte:fragment>
</DashboardModal>
