<script lang="ts">
	import { padIt } from '$lib/TSHelpers/DateHelper';
	import { getAltNoEventString } from './CalendarFuncs';
	import type { Event } from '$lib/types';

	export let currentEvents: Array<Event>;
	export let selectedDate: Date;
</script>

<div class="space-y-3 w-full flex-col justify-center">
	{#if currentEvents.length == 0}
		<p class="font-semibold text-center">{getAltNoEventString(selectedDate)}</p>
	{:else}
		{#each currentEvents as { start, end, title, room, instructor, remarks, color }}
			<div
				class="flex flex-row rounded-xl space-x-1 pr-4 bg-surface-100-800-token border border-surface-300-600-token"
			>
				<div class="min-w-3 h-auto rounded-l-3xl" style="background-color: {color};" />
				<div class="w-full flex flex-col justify-center items-center">
					<div>
						<p class="text-sm pt-1">
							{padIt(start.getHours().toString()) +
								':' +
								padIt(start.getMinutes().toString()) +
								' - ' +
								padIt(end.getHours().toString()) +
								':' +
								padIt(end.getMinutes().toString())}
						</p>
					</div>
					<div>
						<p class="font-semibold">
							{title}
						</p>
					</div>
					<div>
						{#if remarks}
							<div class="flex flex-row space-x-2">
								<i class="fa-solid fa-info-circle"></i>
								<p class="text-xs w-full flex-grow">
									{remarks}
								</p>
							</div>
						{/if}
					</div>
					<div>
						<p>
							{#if instructor && room}
								{instructor}, Raum {room}
							{:else if instructor}
								{instructor}
							{:else if room}
								Raum: {room}
							{/if}
						</p>
					</div>
				</div>
			</div>
		{/each}
	{/if}
</div>
