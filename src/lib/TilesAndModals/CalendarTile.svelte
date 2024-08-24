<script lang="ts">
	import DashboardTile from '$lib/DashboardTile.svelte';
	import CalendarModal from './CalendarModal.svelte';
	import CalendarSelector from '$lib/Calendar/CalendarSelector.svelte';
	import CalendarView from '$lib/Calendar/CalendarView.svelte';
	import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { persistentStore } from '$lib/TSHelpers/LocalStorageHelper';
	import { dateIsToday, getAltDayString, getNextWeekday } from '$lib/TSHelpers/DateHelper';
	import { createEventDispatcher } from 'svelte';
	import { getCurrentEvents, unixEventsToEvents } from '$lib/Calendar/CalendarFuncs';
	import { type ToastPayload, ToastPayloadClass } from '$lib/types';
	import { type Writable } from 'svelte/store';
	import type { EventUnix, Event } from '$lib/types';

	const dispatch = createEventDispatcher();

	export let isReloading: boolean = false;

	let currentEvents: Array<Event> = [];
	let modalStore = getModalStore();
	let modalComponent: ModalComponent;
	let modal: ModalSettings;
	let storedEventsUnix: Writable<EventUnix[]>;
	let lastEventUpdate: Writable<Date | null>;
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

	onMount(async () => {
		storedEventsUnix = persistentStore('storedEvents', []);
		lastEventUpdate = persistentStore('lastEventUpdate', null);

		currentEvents = getCurrentEvents(unixEventsToEvents($storedEventsUnix), selectedDate);

		modalComponent = {
			ref: CalendarModal,
			props: {
				storedEvents: storedEventsUnix,
				selectedDate: selectedDate,
				onUpdateSelectedDate: updateSelectedDate
			}
		};

		modal = {
			type: 'component',
			component: modalComponent
		};

		if (olderThanOneHour($lastEventUpdate)) {
			fetchCalendar();
		}
	});

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

	function handleSelectedDateChange(e: CustomEvent<Date>) {
		selectedDate = e.detail;
		modalComponent.props!.selectedDate = selectedDate;
		currentEvents = getCurrentEvents(unixEventsToEvents($storedEventsUnix), selectedDate);
	}

	function openModal() {
		modalStore.trigger(modal);
	}

	function olderThanOneHour(s_date: Date | null): boolean {
		if (!s_date) {
			return true;
		}

		// stores cant store dates, it's a string
		let date = new Date(s_date);
		let currDate = new Date();
		const diffInMs = currDate.getTime() - date.getTime();
		const diffHours = diffInMs / (1000 * 60 * 60);

		return diffHours > 1;
	}

	function setToToday() {
		selectedDate = getNextWeekday();
		modalComponent.props!.selectedDate = selectedDate;
		currentEvents = getCurrentEvents(unixEventsToEvents($storedEventsUnix), selectedDate);
	}

	function updateSelectedDate(newDate: Date) {
		selectedDate = newDate;
		modalComponent.props!.selectedDate = selectedDate;
		currentEvents = getCurrentEvents(unixEventsToEvents($storedEventsUnix), selectedDate);
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
		let parsedUnix = fetchedToUnixEvents(fetchedCalendar);

		storedEventsUnix.set(parsedUnix);
		lastEventUpdate.set(new Date());
		currentEvents = getCurrentEvents(unixEventsToEvents($storedEventsUnix), selectedDate);

		isReloading = false;
	}
</script>

<DashboardTile
	title="Kalender{!(new Date().getDay() == 0 || new Date().getDay() == 6) &&
	dateIsToday(selectedDate)
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
			inTile={true}
			on:dateChanged={handleSelectedDateChange}
			on:setToToday={setToToday}
			{selectedDate}
		/>
	</svelte:fragment>
	<div class="w-full h-full flex flex-col justify-center items-center">
		<CalendarView {currentEvents} {selectedDate} />
	</div>
</DashboardTile>
