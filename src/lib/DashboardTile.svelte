<script lang="ts">
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { createEventDispatcher } from 'svelte';
	import TileInteractiveElementWrapper from './TileInteractiveElementWrapper.svelte';

	export let title: string;
	export let clickable: boolean = true;
	export let ready: boolean = false;
	export let add_class: string = '';

	const dispatch = createEventDispatcher();
</script>

<button
	on:click={() => dispatch('click')}
	aria-label={title}
	class="{add_class} {ready
		? ''
		: 'pointer-events-none'} h-full bg-[#ddb8c1] dark:bg-[#3b1725] flex flex-col items-center w-full sm:w-96 rounded-xl p-4 pt-2 pb-3 space-y-1"
>
	<div class="flex items-center w-full">
		{#if clickable}
			<i class="{ready ? '' : 'opacity-40'} w-4 fa-solid fa-up-right-and-down-left-from-center" />
		{/if}
		<header class="flex-grow text-xl font-bold text-center">{title}</header>
		{#if clickable}
			<div class="w-4" />
		{/if}
	</div>
	{#if ready}
		<TileInteractiveElementWrapper>
			<slot name="header" />
		</TileInteractiveElementWrapper>
	{/if}

	<div class="flex flex-col items-center justify-center w-full h-full">
		{#if ready}
			<slot />
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

	{#if ready}
		<TileInteractiveElementWrapper>
			<slot name="footer" />
		</TileInteractiveElementWrapper>
	{/if}
</button>
