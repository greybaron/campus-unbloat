<script lang="ts">
	import { ProgressRadial } from '@skeletonlabs/skeleton';

	export let title: string;
	export let clickable: boolean = true;
	export let ready: boolean = false;

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>

<button
	on:click={() => dispatch('click')}
	class="{clickable
		? ''
		: 'pointer-events-none'} variant-glass-primary flex flex-col items-center w-80 rounded-xl p-4 pt-2 pb-3 space-y-1"
>
	<div class="flex items-center w-full">
		<i class="w-4 fa-solid fa-up-right-and-down-left-from-center"></i>
		<header class="flex-grow text-xl font-bold text-center">{title}</header>
		<div class="w-4" />
	</div>

	<div class="flex flex-col items-center justify-center w-full h-full">
		{#if ready}
			<slot name="body" />
		{:else}
			<ProgressRadial
				width="w-20"
				stroke={80}
				value={undefined}
				strokeLinecap="round"
				track="stroke-surface-500/30 dark:stroke-surface-300/30"
			/>
		{/if}
	</div>
</button>
