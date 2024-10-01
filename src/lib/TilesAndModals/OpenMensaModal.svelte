<script lang="ts">
	import { onMount, type SvelteComponent } from 'svelte';
	import { ProgressRadial } from '@skeletonlabs/skeleton';

	import DashboardModal from '$lib/DashboardModal.svelte';
	import type { Canteen } from '$lib/types';

	export let parent: SvelteComponent;
	export let onOpenMensaSelection: (canteenId: number, canteenName: string) => void;

	let canteens: Canteen[];
	let filteredCanteens: Canteen[];
	let filter: string;
	let filterElement: HTMLInputElement;
	$: filterCanteens(filter);

	onMount(async () => {
		const res = await fetch('/api/mensa/openmensacanteens');

		canteens = await res.json();
		filteredCanteens = canteens;
	});

	function filterCanteens(filter: string) {
		if (filter == '') {
			filteredCanteens = canteens;
		} else if (filter) {
			const words = filter.split(' ').map((word) => word.trim().toLowerCase());
			filteredCanteens = canteens.filter((canteen) =>
				words.every((word) => canteen.name.toLowerCase().includes(word))
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

	{#if filteredCanteens}
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-2">
			{#each filteredCanteens as canteen}
				<button
					class="rounded-token flex items-center px-4 py-2 bg-[#ddb8c1] dark:bg-[#3b1725]"
					on:click={() => {
						parent.onClose();
						onOpenMensaSelection(canteen.id, canteen.name);
					}}
				>
					<p class="flex-grow">{canteen.name}</p>
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
