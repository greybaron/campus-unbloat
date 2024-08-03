<script lang="ts">
	import DashboardModal from '$lib/DashboardModal.svelte';

	import { type SvelteComponent } from 'svelte';
	import type { Writable } from 'svelte/store';

	export let parent: SvelteComponent;
	export let componentOrder: Writable<string[]>;

	const tileNames: Map<string, string> = new Map([
		['BasicInfoTile', 'Deine Infos'],
		['GradesTile', 'Noten'],
		['ExamSignupTile', 'Prüfungen'],
		['MensaTile', 'Mensa'],
		['CalendarTile', 'Kalender']
	]);

	let items = $componentOrder.map((id) => ({ id, title: tileNames.get(id) }));

	function handleSort(e: CustomEvent) {
		items = e.detail.items;
	}

	function finalize(e: CustomEvent) {
		handleSort(e);
		componentOrder.set(items.map((item) => item.id));
	}

	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
</script>

<DashboardModal bind:parent title="Anordnung ändern">
	<div class="space-y-2" use:dndzone={{ items }} on:consider={handleSort} on:finalize={finalize}>
		{#each items as item (item.id)}
			<div
				animate:flip={{ duration: 200 }}
				class="rounded-token flex items-center px-4 py-2 bg-[#ddb8c1] dark:bg-[#3b1725]"
			>
				<p class="flex-grow">{item.title}</p>
				<i class="fa-solid fa-bars"></i>
			</div>
		{/each}
	</div>
</DashboardModal>
