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
		: 'pointer-events-none'} variant-glass-primary flex flex-col items-center w-80 rounded-xl p-4 pt-1 pb-2 space-y-1"
>
	<header class="text-xl font-bold text-left">{title}</header>
	<hr />
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
</button>
