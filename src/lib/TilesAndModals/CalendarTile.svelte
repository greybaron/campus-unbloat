<script lang="ts">
	import DashboardTile from '$lib/DashboardTile.svelte';
	import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import CalendarModal from './CalendarModal.svelte';
	import Calendar from '@event-calendar/core';
	import List from '@event-calendar/list';

	let modalStore = getModalStore();
	let modalComponent: ModalComponent;
	let modal: ModalSettings;

	let calendar: Array<{
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

	let parsedCalendar: Array<{
		id: number;
		start: Date;
		end: Date;
		title: string;
		backgroundColor: string;
		textColor: string;
		resourceIds: [];
		editable: false;
		startEditable: false;
		durationEditable: false;
		display: 'auto';
		extendedProps: [];
	}> = [];

	let plugins = [List];
	let options = {
		view: 'listDay',
		events: [
			{
				start: new Date(new Date().setHours(0, 0, 0, 0).valueOf() + 3600),
				end: new Date(new Date().setHours(23, 59, 59, 0).valueOf() - 7200),
				title: 'test',
				backgroundColor: '#FFA500',
				textColor: '#FFFFFF'
			}
		]
	};

	function yallahParseDenKalender() {
		let identifier = 0;
		calendar.forEach((element) => {
			parsedCalendar.push({
				id: identifier,
				start: new Date(element.start * 1000),
				end: new Date(element.end * 1000),
				title: element.title + '\n' + element.room,
				backgroundColor: element.color == 'orange' ? '#FFA500' : '#8B0000',
				textColor: '#FFFFFF',
				resourceIds: [],
				editable: false,
				startEditable: false,
				durationEditable: false,
				display: 'auto',
				extendedProps: []
			});
			identifier++;
		});
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
		calendar = await res.json();

		yallahParseDenKalender();

		options.events = parsedCalendar;
	});

	function openModal() {
		modalStore.trigger(modal);
	}
</script>

<DashboardTile title="Kalender" on:click={openModal}>
	<svelte:fragment slot="body">
		{#if parsedCalendar}
			<Calendar {plugins} {options} />
		{/if}
	</svelte:fragment>
</DashboardTile>
