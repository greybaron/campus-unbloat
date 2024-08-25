<script lang="ts">
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { onMount, createEventDispatcher } from 'svelte';

	import { ToastPayloadClass, type Timeline, type ToastPayload } from '$lib/types';
	import DashboardTile from '$lib/DashboardTile.svelte';

	const dispatch = createEventDispatcher();

	let timeline: Timeline;

	onMount(async () => {
		const res = await fetch('/api/timeline');

		if (!res.ok) {
			let error = await res.text();
			let payload: ToastPayload = {
				text: error,
				class: ToastPayloadClass.error
			};
			dispatch('showToast', payload);
			return;
		} else {
			timeline = await res.json();
		}
	});
</script>

<DashboardTile title="Blockplan" clickable={false} ready={Boolean(timeline)}>
	<Accordion>
		{#if timeline.fachsemester.length > 0}
			<AccordionItem>
				<svelte:fragment slot="summary">Fachsemester</svelte:fragment>
				<svelte:fragment slot="content">
					<ul class="list-disc list-inside text-left">
						{#each timeline.fachsemester as fsevent}
							<li class="text-xs">{fsevent.description}</li>
						{/each}
					</ul>
				</svelte:fragment>
			</AccordionItem>
		{/if}

		{#if timeline.theoriesemester.length > 0}
			<AccordionItem>
				<svelte:fragment slot="summary">Theoriesemester</svelte:fragment>
				<svelte:fragment slot="content">
					<ul class="list-disc list-inside text-left">
						{#each timeline.theoriesemester as tsevent}
							<li class="text-xs">{tsevent.description}</li>
						{/each}
					</ul>
				</svelte:fragment>
			</AccordionItem>
		{/if}

		{#if timeline.praxissemester.length > 0}
			<AccordionItem>
				<svelte:fragment slot="summary">Praxissemester</svelte:fragment>
				<svelte:fragment slot="content">
					<ul class="list-disc list-inside text-left">
						{#each timeline.praxissemester as psevent}
							<li class="text-xs">{psevent.description}</li>
						{/each}
					</ul>
				</svelte:fragment>
			</AccordionItem>
		{/if}

		{#if timeline.specials.length > 0}
			<AccordionItem>
				<svelte:fragment slot="summary">Spezielles</svelte:fragment>
				<svelte:fragment slot="content">
					<ul class="list-disc list-inside text-left">
						{#each timeline.specials as spevent}
							<li class="text-xs">{spevent.description}</li>
						{/each}
					</ul>
				</svelte:fragment>
			</AccordionItem>
		{/if}
	</Accordion>
</DashboardTile>
