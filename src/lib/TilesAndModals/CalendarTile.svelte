<script lang="ts">
	import DashboardTile from '$lib/DashboardTile.svelte';
	import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import CalendarModal from './CalendarModal.svelte';
	import { type Writable } from 'svelte/store';
	import { persistentStore } from '$lib/TSHelpers/LocalStorageHelper';
	import { getAltDayString, getNextWeekday } from '$lib/TSHelpers/DateHelper';
	import type { EventUnix, Event } from '$lib/types';
	import { createEventDispatcher } from 'svelte';
	import { type ToastPayload, ToastPayloadClass } from '$lib/types';
	import CalendarSelector from '$lib/Calendar/CalendarSelector.svelte';
	import CalendarView from '$lib/Calendar/CalendarView.svelte';
	import { getCurrentEvents, unixEventsToEvents } from '$lib/Calendar/CalendarFuncs';

	const dispatch = createEventDispatcher();

	export let isReloading: boolean = false;

	let currentEvents: Array<Event> = [];
	let lastEventUpdate: Date;
	let modalStore = getModalStore();
	let modalComponent: ModalComponent;
	let modal: ModalSettings;
	let storedEventsUnix: Writable<EventUnix[]>;
	let lastEventUpdateDate: Writable<Date>;
	let selectedDate: Date = getNextWeekday();

	type fetchedCalendar = Array<{
		title: string;
		start: number; // UNIX Timestamp
		end: number; // UNIX Timestamp
		allDay: boolean;
		description: string;
		color: string;
		font_color: string;
		editable: boolean;
		room: string;
		sroom: string;
		instructor: string;
		sinstructor: string;
		remarks: string;
	}>;

	function fetchedToUnixEvents(fetched: fetchedCalendar): EventUnix[] {
		let newEventsUnix: EventUnix[] = [];

		fetched.forEach((element) => {
			newEventsUnix.push({
				start: element.start,
				end: element.end,
				title: element.title.split('-')[1],
				room: element.room.split(' ')[0],
				instructor: element.instructor,
				textColor: element.font_color,
				remarks: element.remarks,
				color: element.color
			});
		});

		return newEventsUnix;
	}

	function openModal() {
		modalStore.trigger(modal);
	}

	function olderThanOneHour(currDate: Date, selectedDate: Date): boolean {
		if (!selectedDate) {
			return true;
		}
		const diffInMs = currDate.getTime() - new Date(selectedDate).getTime();
		const diffTime = diffInMs / (1000 * 60 * 60);
		if (diffTime > 1 || diffTime == 0) {
			return true;
		}
		return false;
	}

	async function fetchCalendar() {
		isReloading = true;
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
		console.log(fetchedCalendar);
		let parsedUnix = fetchedToUnixEvents(fetchedCalendar);

		storedEventsUnix.set(parsedUnix);
		lastEventUpdateDate.set(new Date());
		currentEvents = getCurrentEvents(unixEventsToEvents($storedEventsUnix), selectedDate);

		isReloading = false;
	}

	onMount(async () => {
		storedEventsUnix = persistentStore('storedEvents', []);
		lastEventUpdateDate = persistentStore('lastEventUpdate', new Date());

		currentEvents = getCurrentEvents(unixEventsToEvents($storedEventsUnix), selectedDate);
		lastEventUpdate = $lastEventUpdateDate;

		modalComponent = {
			ref: CalendarModal,
			props: {
				storedEvents: storedEventsUnix,
				selectedDate: selectedDate
			}
		};

		modal = {
			type: 'component',
			component: modalComponent
		};

		if (olderThanOneHour(new Date(), lastEventUpdate)) {
			fetchCalendar();
		}
	});

	function handleSelectedDateChange(e: CustomEvent<Date>) {
		selectedDate = e.detail;
		modalComponent.props!.selectedDate = selectedDate;
		currentEvents = getCurrentEvents(unixEventsToEvents($storedEventsUnix), selectedDate);
	}

	function setToToday() {
		selectedDate = getNextWeekday();
		modalComponent.props!.selectedDate = selectedDate;
		currentEvents = getCurrentEvents(unixEventsToEvents($storedEventsUnix), selectedDate);
	}
</script>

<DashboardTile
	title="Kalender{!(new Date().getDay() == 0 || new Date().getDay() == 6)
		? ''
		: ` (${getAltDayString(selectedDate)})`}"
	on:click={openModal}
	on:reload={() => {
		fetchCalendar();
	}}
	ready={storedEventsUnix && $storedEventsUnix.length != 0}
	reloadable={true}
	reloading={isReloading}
>
	<svelte:fragment slot="header">
		<CalendarSelector
			on:dateChanged={handleSelectedDateChange}
			on:setToToday={setToToday}
			{selectedDate}
		/>
	</svelte:fragment>
	<div class="w-full h-full flex flex-col justify-center items-center">
		<CalendarView {currentEvents} {selectedDate} />
	</div>
</DashboardTile>
