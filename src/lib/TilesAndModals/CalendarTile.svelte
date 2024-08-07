<script lang="ts">
	import DashboardTile from '$lib/DashboardTile.svelte';
	import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import CalendarModal from './CalendarModal.svelte';
	import { type Writable } from 'svelte/store';
	import { persistentStore } from '$lib/TSHelpers/LocalStorageHelper';
	import { getNextWeekday } from '$lib/TSHelpers/DateHelper';
	import type { EventUnix, Event } from '$lib/types';
	import { createEventDispatcher } from 'svelte';
	import { getCurrentEvents, type ToastPayload, ToastPayloadClass } from '$lib/types';

	const dispatch = createEventDispatcher();

	let todaysEvents: Array<Event> = [];
	let lastEventUpdate: Date;
	let modalStore = getModalStore();
	let modalComponent: ModalComponent;
	let modal: ModalSettings;
	let storedEventsUnix: Writable<EventUnix[]>;
	let lastEventUpdateDate: Writable<Date>;
	let isReloading: boolean = false;

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

	function getTodaysCalendarTitle(): string {
		if (new Date().getDay() == 0 || new Date().getDay() == 6) {
			return 'Montag (' + getNextWeekday().getDate() + '.' + getNextWeekday().getMonth() + '.)';
		}

		let currentDay = getNextWeekday().getDate().toString().padStart(2, '0');
		let currentMonth = (getNextWeekday().getMonth() + 1).toString().padStart(2, '0'); // In JS werden Monate von 0 - 11 gezählt, deswegen getMonth()+1

		return 'Heute (' + currentDay + '.' + currentMonth + '.)';
	}

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

	function openModal() {
		modalStore.trigger(modal);
	}

	function olderThanOneHour(currDate: Date, selectedDate: Date): boolean {
		if (selectedDate == null || selectedDate == undefined) {
			return true;
		}
		const diffInMs = currDate.getTime() - new Date(selectedDate).getTime();
		const diffTime = diffInMs / (1000 * 60 * 60);
		if (diffTime > 1 || diffTime == 0) {
			return true
		}
		return false;
	}

	async function fetchCalendar() {

		console.log('Fetching new Calendar');
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

		todaysEvents = getCurrentEvents(unixEventsToEvents(parsedUnix));

		storedEventsUnix.set(parsedUnix);
		lastEventUpdateDate.set(new Date);

		console.log('Fetched New Calendar Successfully');
		isReloading = false;
	}

	onMount(async () => {
		storedEventsUnix = persistentStore('storedEvents', []);
		lastEventUpdateDate = persistentStore('lastEventUpdate', new Date());

		todaysEvents = getCurrentEvents(unixEventsToEvents($storedEventsUnix));
		lastEventUpdate = $lastEventUpdateDate;

		modalComponent = {
			ref: CalendarModal,
			props: { storedEvents: storedEventsUnix }
		};

		modal = {
			type: 'component',
			component: modalComponent
		};

		if (olderThanOneHour(new Date(), lastEventUpdate)) {
			console.log('Calendar older than one hour');
			fetchCalendar();
		} else {
			console.log('No New Calendar Was Fetched');
		}
	});
</script>

<DashboardTile
	title="Kalender"
	on:click={openModal}
	on:reload={() => {fetchCalendar(); isReloading = true;}}
	ready={storedEventsUnix && $storedEventsUnix.length != 0}
	reloadable={true}
	reloading={isReloading}
>
	<p class="font-semibold">{getTodaysCalendarTitle()}</p>

	<div class="space-y-3 pr-1 pl-1 pt-2 w-full pb-1 flex-col items-center">
		{#if todaysEvents.length == 0}
			<p class="font-semibold">Heute findet keine Vorlesungen statt! 🚀</p>
		{:else}
			{#each todaysEvents as { start, end, title, room, instructor, remarks, color }}
				<div class="flex flex-row justify-start rounded-xl space-x-1 pr-4 bg-surface-100-800-token">
					<div class="min-w-3 h-auto rounded-l-3xl" style="background-color: {color};" />
					<div class="w-full flex flex-col">
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
</DashboardTile>
