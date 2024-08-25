<script lang="ts">
	import { onDestroy, onMount, type SvelteComponent } from 'svelte';

	export let title: string;
	export let parent: SvelteComponent;
	export let dynamicwidth: boolean = false;

	const htmlElement = document.documentElement;
	const themeColorMeta = document.querySelector('meta[name="theme-color"]');

	let closeButton: HTMLButtonElement;

	onMount(() => {
		// any browser focuses the button by default, no idea why
		closeButton.blur();

		const isDarkMode = htmlElement.classList.contains('dark');
		themeColorMeta?.setAttribute('content', isDarkMode ? 'rgb(23,23,23)' : 'rgb(139,139,139)');
	});

	onDestroy(() => {
		const isDarkMode = htmlElement.classList.contains('dark');
		themeColorMeta?.setAttribute('content', isDarkMode ? 'rgb(27,27,27)' : 'rgb(213,213,217)');
	});
</script>

<div
	class="{dynamicwidth
		? ''
		: 'w-modal'} modal block bg-surface-100-800-token h-auto px-1 py-4 space-y-4 rounded-container-token shadow-xl"
	role="dialog"
>
	<div class="px-3 flex w-full items-center">
		<header class="flex-grow text-2xl font-bold">{title}</header>
		<button
			bind:this={closeButton}
			on:click={() => {
				parent.onClose();
			}}
			class="size-8 fa-solid fa-xmark scale-150"
		/>
	</div>
	<div class="px-3">
		<slot name="header" />
	</div>
	<div
		class="px-3 overflow-y-auto {$$slots.header
			? 'max-h-safe-screen-with-header'
			: 'max-h-safe-screen'}"
	>
		<slot />
	</div>
</div>
