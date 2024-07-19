<script lang="ts">
	import DashboardTile from '$lib/DashboardTile.svelte';
	import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import CalendarModal from './CalendarModal.svelte';
	import Calendar from '@event-calendar/core';
	import List from '@event-calendar/list';
	import { type Writable } from 'svelte/store';
	import { persistentStore } from '$lib/TSHelpers/LocalStorageHelper';
	import { getNextWeekday } from '$lib/TSHelpers/DateHelper';
	import type { EventUnix, Event } from '$lib/types';

	let modalStore = getModalStore();
	let modalComponent: ModalComponent;
	let modal: ModalSettings;

	type fetchedCalendar = Array<{
		title: string;
		start: number; // UNIX Timestamp
		end: number; // UNIX Timestamp
		allDay: boolean;
		description: string;
		color: string;
		editable: boolean;
		room: string;
		sroom: string;
		instructor: string;
		sinstructor: string;
		remarks: string;
	}>;

	let storedEventsUnix: Writable<EventUnix[]>;

	let plugins = [List];
	let emptyEvents: Event[] = [];
	let options = {
		view: 'listDay',
		events: emptyEvents,
		date: getNextWeekday(),
		headerToolbar: { start: '', center: '', end: '' }
	};

	function fetchedToUnixEvents(fetched: fetchedCalendar): EventUnix[] {
		let newEventsUnix: EventUnix[] = [];

		fetched.forEach((element) => {
			newEventsUnix.push({
				start: element.start,
				end: element.end,
				title: element.title + '\n' + element.room,
				backgroundColor: element.color,
				textColor: '#FFFFFF'
			});
		});

		return newEventsUnix;
	}

	function unixEventsToEvents(uEvents: Array<EventUnix>): Array<Event> {
		let events: Event[] = [];

		uEvents.forEach((event) => {
			events.push({
				start: new Date(event.start),
				end: new Date(event.end),
				title: event.title,
				backgroundColor: event.backgroundColor,
				textColor: event.textColor
			});
		});

		return events;
	}

	import { createEventDispatcher } from 'svelte';
	import { type ToastPayload, ToastPayloadClass } from '$lib/types';
	const dispatch = createEventDispatcher();

	onMount(async () => {
		storedEventsUnix = persistentStore('storedEvents', []);
		let events = unixEventsToEvents($storedEventsUnix);

		options.events = events;

		modalComponent = {
			ref: CalendarModal,
			props: { storedEvents: storedEventsUnix }
		};

		modal = {
			type: 'component',
			component: modalComponent
		};

		console.log('Fetching calendar');
		const res = await fetch('/api/stundenplan');

		if (!res.ok) {
			let error = await res.text();
			let payload: ToastPayload = {
				text: error,
				class: ToastPayloadClass.error
			};

			dispatch('showToast', payload);
			return;
		}

		let fetchedCalendar = await res.json();
		let parsedUnix = fetchedToUnixEvents(fetchedCalendar);
		let parsed = unixEventsToEvents(parsedUnix);

		options.events = parsed;
		storedEventsUnix.set(parsedUnix);
	});

	function openModal() {
		modalStore.trigger(modal);
	}
</script>

<DashboardTile title="Kalender" on:click={openModal} ready={options.events.length != 0}>
	<svelte:fragment slot="body">
		<Calendar {plugins} {options} />
	</svelte:fragment>
</DashboardTile>
