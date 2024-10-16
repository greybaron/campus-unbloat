<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { ProgressRadial } from '@skeletonlabs/skeleton';

	import TileInteractiveElementWrapper from './TilesAndModals/TileInteractiveElementWrapper.svelte';

	export let title: string;
	export let clickable: boolean = true;
	export let reloadable: boolean = false;
	export let reloading: boolean = false;
	export let ready: boolean = false;

	const dispatch = createEventDispatcher();
	let pointerPressed = false;

	function hasParentWithClass(element: HTMLElement, classname: string): boolean {
		let currentElement: HTMLElement | null = element;

		while (currentElement) {
			if (currentElement.classList.contains(classname)) {
				return true;
			}
			currentElement = currentElement.parentElement;
		}

		return false;
	}

	function handlePointerStart(e: PointerEvent) {
		let target = e.target as HTMLElement;
		if (
			!clickable ||
			(hasParentWithClass(target, 'dont-open-modal') &&
				!hasParentWithClass(target, 'override-open-modal'))
		) {
			return;
		}

		pointerPressed = true;
		window.addEventListener('pointercancel', handlePointerEnd);
		window.addEventListener('pointerup', handlePointerEnd);
	}

	function handlePointerEnd() {
		pointerPressed = false;
		window.removeEventListener('pointercancel', handlePointerEnd);
		window.removeEventListener('pointerup', handlePointerEnd);
	}
</script>

<button
	on:click={() => dispatch('click')}
	on:pointerdown={handlePointerStart}
	aria-label={title}
	disabled={!clickable}
	class="{pointerPressed
		? 'scale-[97%]'
		: ''} transition-transform h-full bg-[#ddb8c1] dark:bg-[#3b1725] flex flex-col items-center w-full sm:w-96 rounded-2xl p-4 pt-2 pb-3 space-y-1"
>
	<div class="flex flex-row w-full items-center justify-between">
		{#if clickable}
			<i class="{ready ? '' : 'opacity-40'} w-4 fa-solid fa-up-right-and-down-left-from-center" />
		{/if}
		<header class="flex-grow w-full text-xl font-bold text-center">{title}</header>
		{#if reloadable}
			<TileInteractiveElementWrapper>
				{#if reloading}
					<ProgressRadial
						width="w-4 scale-125"
						stroke={80}
						value={undefined}
						strokeLinecap="round"
						track="stroke-surface-500/30 dark:stroke-surface-300/30"
					/>
				{:else}
					<button
						id="calendarReloadButton"
						aria-label="Daten neu laden"
						class=" flex-shrink-0 btn-icon fa-solid fa-check size-4 scale-110"
						on:click={() => dispatch('reload')}
						on:mouseenter={() => {
							document.getElementById('calendarReloadButton')?.classList.remove('fa-check');
							document.getElementById('calendarReloadButton')?.classList.add('fa-rotate-right');
						}}
						on:mouseleave={() => {
							document.getElementById('calendarReloadButton')?.classList.add('fa-check');
							document.getElementById('calendarReloadButton')?.classList.remove('fa-rotate-right');
						}}
					/>
				{/if}
			</TileInteractiveElementWrapper>
		{:else if clickable}
			<div class="w-4" />
		{/if}
	</div>
	{#if ready}
		<slot name="header" />
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
