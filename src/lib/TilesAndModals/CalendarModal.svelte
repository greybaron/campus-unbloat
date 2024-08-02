<script lang="ts">
	import DashboardModal from '$lib/DashboardModal.svelte';
	import Calendar from '@event-calendar/core';
	import TimeGrid from '@event-calendar/time-grid';
	import type { EventContentArg } from '@fullcalendar/core';
	import type { Writable } from 'svelte/store';
	import { type EventUnix, type Event, getCurrentEvents } from '$lib/types';
	import type { SvelteComponent } from 'svelte';
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';

	export let storedEvents: Writable<EventUnix[]>;
	export let parent: SvelteComponent;

	let view: string = 'week'; // Default-View (Wochenansicht)
	let currentDay: Date = new Date();
	let todaysEvents: Event[] = [];
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
				(arg.event.start?.getHours().toString().padStart(2, '0') +
					':' +
					arg.event.start?.getMinutes().toString().padStart(2, '0') +
					' - ' +
					arg.event.end?.getHours().toString().padStart(2, '0') +
					':' +
					arg.event.end?.getMinutes().toString().padStart(2, '0')) +
				' </p> </div>' +
				'</div>';

			setTimeout(() => {
				let element = document.getElementById(eventId);
				if (element) {
					element.addEventListener('click', () => {
						view = 'day';
						currentDay = arg.event.start as Date;
						todaysEvents = getCurrentEvents(unixEventsToEvents($storedEvents), currentDay);
						options.date = getNextMonday(currentDay);
					});
				}
			}, 0);

			return { html: customHtml };
		}
	};

	$: $storedEvents, run(unixEventsToEvents($storedEvents));

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

	function run(events: Event[]) {
		if (events) {
			options.events = events;
		}
	}
</script>

<DashboardModal bind:parent title="Kalender">
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
		<div class="space-y-3 pr-1 pl-1 pt-2 w-full pb-1 flex-col items-center">
			{#if todaysEvents.length == 0}
				<p class="font-semibold">Heute findet keine Vorlesungen statt! 🚀</p>
			{:else}
				{#each todaysEvents as { start, end, title, room, instructor, remarks, color }}
					<div
						class="flex flex-row justify-start rounded-xl space-x-1 pr-4 bg-surface-200-700-token"
					>
						<div class="min-w-3 h-auto rounded-l-3xl" style="background-color: {color};" />
						<div class="w-full flex flex-col items-center">
							<div>
								<p class="text-sm pt-1">
									{start.getHours().toString().padStart(2, '0') +
										':' +
										start.getMinutes().toString().padStart(2, '0') +
										' - ' +
										end.getHours().toString().padStart(2, '0') +
										':' +
										end.getMinutes().toString().padStart(2, '0')}
								</p>
							</div>
							<div>
								<p class="font-semibold">
									{title}
								</p>
							</div>
							<div>
								{#if remarks != ''}
									<p class="text-xs italic">
										{'(' + remarks + ')'}
									</p>
								{/if}
							</div>
							<div>
								<p class="italic">
									{#if instructor != '' && room != ''}
										{instructor + ', Raum ' + room}
									{:else if instructor != ''}
										{instructor}
									{:else if room != ''}
										{'Raum: ' + room}
									{/if}
								</p>
							</div>
						</div>
					</div>
				{/each}
			{/if}
		</div>
	{:else if view === 'week'}
		<Calendar {plugins} {options} />
	{/if}
</DashboardModal>
