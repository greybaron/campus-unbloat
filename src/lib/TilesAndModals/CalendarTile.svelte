<script lang="ts">
	import DashboardTile from '$lib/DashboardTile.svelte';
	import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import CalendarModal from './CalendarModal.svelte';
	import Calendar from '@event-calendar/core';
	import List from '@event-calendar/list';

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

	let previousEvents: Event[] = [];
	let newEvents: Event[] = [];

	let plugins = [List];
	let options = {
		view: 'listDay',
		events: previousEvents,
		date: getNextMonday(),
		headerToolbar: {start: '', center: '', end: ''}
	};

	function yallahParseDenKalender() {
		fetchedCalendar.forEach((element) => {
			newEvents.push({
				start: new Date(element.start * 1000),
				end: new Date(element.end * 1000),
				title: element.title + '\n' + element.room,
				backgroundColor: element.color == 'orange' ? '#FFA500' : '#8B0000',
				textColor: '#FFFFFF'
			});
		});
		console.log(newEvents);
	}

	function getNextMonday(date = new Date()) {
    	const day = date.getDay();
    	const diff = day === 6 ? 2 : (day === 0 ? 1 : 0); // 6 = Samstag, 0 = Sonntag
    	if (diff > 0) {
    	    date.setDate(date.getDate() + diff);
    	}
    	return date;
	}

	onMount(async () => {
		modalComponent = {
			ref: CalendarModal
			//props: { stats: calendar }
		};

		modal = {
			type: 'component',
			component: modalComponent
		};

		const res = await fetch('/api/stundenplan');
		if (!res.ok) {
			return { props: { error: res.status } };
		}
		fetchedCalendar = await res.json();

		console.log("Calender fetched...");

		yallahParseDenKalender();

		console.log("Calender parsed...");

		options.events = newEvents;
	});

	function openModal() {
		modalStore.trigger(modal);
	}
</script>

<DashboardTile title="Kalender" on:click={openModal} ready={options.events.length != 0}>
	<svelte:fragment slot="body">
		{#if newEvents}
			<Calendar {plugins} {options} />
		{/if}
	</svelte:fragment>
</DashboardTile>
