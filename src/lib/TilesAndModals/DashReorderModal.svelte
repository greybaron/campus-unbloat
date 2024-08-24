<script lang="ts">
	import { type SvelteComponent } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';

	import { tileNames, validateComponentOrder } from '$lib/TSHelpers/ComponentOrder';
	import DashboardModal from '$lib/DashboardModal.svelte';

	export let parent: SvelteComponent;
	export let componentOrder: Writable<string[]>;

	let items = $componentOrder.map((id) => ({ id, title: tileNames.get(id) }));

	function handleSort(e: CustomEvent) {
		items = e.detail.items;
	}

	function finalize(e: CustomEvent) {
		handleSort(e);
		let newSort = items.map((item) => item.id);

		if (!validateComponentOrder(newSort)) {
			window.alert('Reorder failed');
		} else {
			componentOrder.set(newSort);
		}
	}
</script>

<DashboardModal bind:parent title="Anordnung ändern">
	<div
		class="grid grid-cols-1 lg:grid-cols-2 gap-2"
		use:dndzone={{ items, dropTargetStyle: {}, flipDurationMs: 200 }}
		on:consider={handleSort}
		on:finalize={finalize}
	>
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
