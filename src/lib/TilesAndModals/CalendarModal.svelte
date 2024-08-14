<script lang="ts">
	import DashboardModal from '$lib/DashboardModal.svelte';
	import Calendar from '@event-calendar/core';
	import TimeGrid from '@event-calendar/time-grid';
	import type { EventContentArg } from '@fullcalendar/core';
	import type { Writable } from 'svelte/store';
	import { type EventUnix, type Event } from '$lib/types';
	import { onMount, type SvelteComponent } from 'svelte';
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
	import { getCurrentEvents } from '$lib/Calendar/CalendarFuncs';
	import { dateIsToday, getAltDayString, padIt } from '$lib/TSHelpers/DateHelper';
	import TileInteractiveElementWrapper from '$lib/TileInteractiveElementWrapper.svelte';
	import CalendarSelector from '$lib/Calendar/CalendarSelector.svelte';
	import CalendarView from '$lib/Calendar/CalendarView.svelte';
	import { persistentStore } from '$lib/TSHelpers/LocalStorageHelper';

	export let storedEvents: Writable<EventUnix[]>;
	export let selectedDate: Date;
	export let parent: SvelteComponent;


	let titleString: string = "Kalender";
	let view: string = 'week'; // Default-View (Wochenansicht)
	let storedEventsUnix: Writable<EventUnix[]>;
	let currentDayEvents: Event[] = [];
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
		slotMaxTime: '19:00:00',
		displayEventTime: false,
		displayEventEnd: false,
		slotWidth: 60,
		buttonText: { today: 'Heute' },
		nowIndicator: true,
		eventContent: function (arg: EventContentArg) {
			let eventId = 'custom-event-' + arg.event.id;
			let customHtml =
				'<div id="' +
				eventId +
				'" class="flex flex-col items-center justify-center h-full md:space-y-0 -space-y-5 cursor-pointer transition-transform transform hover:scale-105">' +
				'<div class="flex justify-center"> <p class="md:text-xl text-sm">' +
				arg.event.title +
				' </p> </div>' +
				'<div class="flex justify-center"> <p class="md:text-sm md:visible invisible">' +
				(padIt(arg.event.start?.getHours().toString()) +
					':' +
					padIt(arg.event.start?.getMinutes().toString()) +
					' - ' +
					padIt(arg.event.end?.getHours().toString()) +
					':' +
					padIt(arg.event.end?.getMinutes().toString())) +
				' </p> </div>' +
				'</div>';

			setTimeout(() => {
				let element = document.getElementById(eventId);
				if (element) {
					element.addEventListener('click', () => {
						view = 'day';
						selectedDate = arg.event.start as Date;
						currentDayEvents = getCurrentEvents(unixEventsToEvents($storedEvents), selectedDate);
						options.date = getNextMonday(selectedDate);
					});
				}
			}, 0);

			return { html: customHtml };
		}
	};

	$: $storedEvents, run(unixEventsToEvents($storedEvents));
	storedEventsUnix = persistentStore('storedEvents', []);

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

	function getNextMonday(date = selectedDate) {
		const day = date.getDay();
		const diff = day === 6 ? 2 : day === 0 ? 1 : 0; // 6 = Samstag, 0 = Sonntag
		if (diff > 0) {
			date.setDate(date.getDate() + diff);
		}
		return date;
	}

	function run(events: Event[]) {
		if (events) {
			options.events = events;
		}
	}

	function handleSelectedDateChange(e: CustomEvent<Date>) {
		selectedDate = e.detail;
		currentDayEvents = getCurrentEvents(unixEventsToEvents($storedEventsUnix), selectedDate);
	}

	function setToToday() {
		selectedDate = new Date();
		currentDayEvents = getCurrentEvents(unixEventsToEvents($storedEventsUnix), selectedDate);
	}

	$: if(selectedDate || view) refreshTitle(selectedDate); 
	function refreshTitle(date: Date) {
		if (view == 'week' || dateIsToday(date)) {
			titleString = "Kalender";
		} else {
			titleString = "Kalender (" + getAltDayString(date) + ")";
		}
	}
</script>

<DashboardModal bind:parent title={titleString}>
	<div class="radio-group-container w-full flex justify-center pb-2">
		<RadioGroup
			bind:group={view}
			active="variant-filled-primary"
			hover="hover:variant-soft-primary"
		>
			<RadioItem value="week" bind:group={view} name="calendar-view" label="Wochenübersicht"
				>Wochenübersicht</RadioItem
			>
			<RadioItem value="day" bind:group={view} name="calendar-view" label="Tagesansicht"
				>Tagesansicht</RadioItem
			>
		</RadioGroup>
	</div>

	{#if view === 'day'}
		<div class="w-full h-full flex justify-center">
			<div class="flex flex-col items-center justify-center w-3/5">
				<button class="w-full" on:click|stopPropagation={() => {}}>
					<CalendarSelector 
						on:dateChanged={handleSelectedDateChange}
						on:setToToday={setToToday}
						selectedDate = {selectedDate}
					/>
				</button>
				<CalendarView
					currentEvents = {currentDayEvents}
					selectedDate = {selectedDate}
				/>
			</div>
		</div>
	{:else if view === 'week'}
		<Calendar {plugins} {options} />
	{/if}
</DashboardModal>
