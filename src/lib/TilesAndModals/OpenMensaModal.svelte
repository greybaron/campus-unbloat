<script lang="ts">
	import { onMount, type SvelteComponent } from 'svelte';
	import { ProgressRadial } from '@skeletonlabs/skeleton';

	import DashboardModal from '$lib/DashboardModal.svelte';
	import type { Mensa } from '$lib/types';

	export let parent: SvelteComponent;
	export let onOpenMensaSelection: (mensaId: number, mensaName: string) => void;

	let mensen: Mensa[];
	let filteredMensen: Mensa[];
	let filter: string;
	let filterElement: HTMLInputElement;
	$: filterMensen(filter);

	onMount(async () => {
		const res = await fetch('https://openmensa.org/api/v2/canteens');
		mensen = await res.json();
		filteredMensen = mensen;
	});

	function filterMensen(filter: string) {
		if (filter == '') {
			filteredMensen = mensen;
		} else if (filter) {
			const words = filter.split(' ').map((word) => word.trim().toLowerCase());
			filteredMensen = mensen.filter((mensa) =>
				words.every((word) => mensa.name.toLowerCase().includes(word))
			);
		}
	}
</script>

<svelte:window
	on:keydown={() => {
		filterElement.focus();
	}}
/>

<DashboardModal bind:parent title="OpenMensa">
	<svelte:fragment slot="header">
		<input
			bind:this={filterElement}
			bind:value={filter}
			class="input"
			type="text"
			placeholder="Suchen..."
		/>
	</svelte:fragment>

	{#if filteredMensen}
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-2">
			{#each filteredMensen as mensa}
				<button
					class="rounded-token flex items-center px-4 py-2 bg-[#ddb8c1] dark:bg-[#3b1725]"
					on:click={() => {
						parent.onClose();
						onOpenMensaSelection(mensa.id, mensa.name);
					}}
				>
					<p class="flex-grow">{mensa.name}</p>
					<i class="fa-solid fa-circle-arrow-right"></i>
				</button>
			{/each}
		</div>
	{:else}
		<div class="flex justify-center">
			<ProgressRadial
				width="w-20"
				stroke={80}
				value={undefined}
				strokeLinecap="round"
				track="stroke-surface-500/30 dark:stroke-surface-300/30"
			/>
		</div>
	{/if}
</DashboardModal>
