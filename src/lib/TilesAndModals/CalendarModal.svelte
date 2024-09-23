<script lang="ts">
	import Calendar from '@event-calendar/core';
	import TimeGrid from '@event-calendar/time-grid';
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
	import { type SvelteComponent } from 'svelte';
	import type { EventContentArg } from '@fullcalendar/core';
	import type { Writable } from 'svelte/store';

	import type { EventUnix, Event } from '$lib/types';
	import DashboardModal from '$lib/DashboardModal.svelte';
	import CalendarSelector from '$lib/Calendar/CalendarSelector.svelte';
	import CalendarView from '$lib/Calendar/CalendarView.svelte';
	import { getCurrentEvents, unixEventsToEvents } from '$lib/Calendar/CalendarFuncs';
	import { dateIsToday, getAltDayString, getNextWeekday, padIt } from '$lib/TSHelpers/DateHelper';

	export let parent: SvelteComponent;
	export let storedEventsUnix: Writable<EventUnix[]>;
	export let selectedDate: Date;
	export let onUpdateSelectedDate: (newDate: Date) => void;

	let ec: SvelteComponent;
	let view: string = 'week'; // Default-View (Wochenansicht)
	let eventList: Event[] = [];
	let plugins = [TimeGrid];
	let options = {
		view: 'timeGridWeek',
		date: selectedDate,
		events: eventList,
		firstDay: 1,
		hiddenDays: [0, 6],
		allDaySlot: false,
		slotMinTime: '07:30:00',
		slotMaxTime: '19:00:00',
		displayEventTime: false,
		displayEventEnd: false,
		slotWidth: 60,
		headerToolbar: { start: '', center: '', end: '' },
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
						if (onUpdateSelectedDate) {
							onUpdateSelectedDate(selectedDate);
						}
					});
				}
			}, 0);

			return { html: customHtml };
		}
	};

	$: if ($storedEventsUnix) options.events = unixEventsToEvents($storedEventsUnix);

	function handleSelectedDateChange(e: CustomEvent<Date>) {
		selectedDate = e.detail;
		if (ec) {
			ec.setOption('date', selectedDate);
		}
		if (onUpdateSelectedDate) {
			onUpdateSelectedDate(selectedDate);
		}
	}

	function setToToday() {
		selectedDate = getNextWeekday();
		if (ec) {
			ec.setOption('date', selectedDate);
		}
		if (onUpdateSelectedDate) {
			onUpdateSelectedDate(selectedDate);
		}
	}
</script>

<DashboardModal
	bind:parent
	title="Kalender{view == 'week' || dateIsToday(selectedDate)
		? ''
		: ` (${getAltDayString(selectedDate)})`}"
>
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
		{@const currentDayEvents = getCurrentEvents(options.events, selectedDate)}
		<div class="w-full h-full flex justify-center">
			<div class="flex flex-col items-center justify-center md:w-3/5 w-4/5">
				<button class="w-full" on:click|stopPropagation={() => {}}>
					<CalendarSelector
						on:dateChanged={handleSelectedDateChange}
						on:setToToday={setToToday}
						{selectedDate}
					/>
				</button>
				<CalendarView currentEvents={currentDayEvents} {selectedDate} />
			</div>
		</div>
	{:else if view === 'week'}
		<CalendarSelector
			disablePadding={true}
			on:dateChanged={handleSelectedDateChange}
			on:setToToday={setToToday}
			{selectedDate}
			weeklySkibbers={true}
		/>
		<Calendar bind:this={ec} {plugins} {options} />
	{/if}
</DashboardModal>
