<script lang="ts">
	import DashboardTile from '$lib/DashboardTile.svelte';
	import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import CalendarModal from './CalendarModal.svelte';
	import Calendar from '@event-calendar/core';
	import List from '@event-calendar/list';
	import { type Writable } from 'svelte/store';
	import { persistentStore } from '$lib/TSHelpers/LocalStorageHelper';
	import { convertToBerlinTime, getNextWeekday } from '$lib/TSHelpers/DateHelper';

	interface Event {
		start: Date;
		end: Date;
		title: string;
		backgroundColor: string;
		textColor: string;
	}

	let modalStore = getModalStore();
	let modalComponent: ModalComponent;
	let modal: ModalSettings;

	let fetchedCalendar: Array<{
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

	let storedEvents: Writable<Event[]>;
	let calendarEvents: Event[] = [];

	let plugins = [List];
	let options = {
		view: 'listDay',
		events: calendarEvents,
		date: getNextWeekday(),
		headerToolbar: { start: '', center: '', end: '' }
	};

	function yallahParseDenKalender() {
		let newEvents: Event[] = [];

		fetchedCalendar.forEach((element) => {
			newEvents.push({
				start: new Date(element.start * 1000),
				end: new Date(element.end * 1000),
				title: element.title + '\n' + element.room,
				backgroundColor: element.color == 'orange' ? '#FFA500' : '#8B0000',
				textColor: '#FFFFFF'
			});
		});

		return newEvents;
	}

	onMount(async () => {
		storedEvents = persistentStore('storedEvents', []);

		$storedEvents.forEach((e) => {
			e.start = convertToBerlinTime(new Date(e.start));
			e.end = convertToBerlinTime(new Date(e.end));
		});

		options.events = $storedEvents;

		modalComponent = {
			ref: CalendarModal,
			props: { storedEvents: storedEvents }
		};

		modal = {
			type: 'component',
			component: modalComponent
		};

		const res = await fetch('/api/stundenplan');
		if (!res.ok) {
			return { props: { error: res.status } };
		}
		console.log('Fetching calendar');
		fetchedCalendar = await res.json();

		let parsed = yallahParseDenKalender();
		options.events = parsed;
		storedEvents.set(parsed);
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
