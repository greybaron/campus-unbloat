<script lang="ts">
	import { onMount, type SvelteComponent } from 'svelte';

	export let title: string;
	export let parent: SvelteComponent;
	export let dynamicwidth: boolean = false;

	let closeButton: HTMLButtonElement;

	// any browser focuses the button by default, no idea why
	onMount(() => {
		closeButton.blur();
	});
</script>

<div
	class="{dynamicwidth
		? ''
		: 'w-modal'} modal block bg-surface-100-800-token h-auto p-4 space-y-4 rounded-container-token shadow-xl"
	role="dialog"
>
	<div class="flex w-full items-center">
		<header class="flex-grow text-2xl font-bold">{title}</header>
		<button bind:this={closeButton}
			on:click={() => {
				parent.onClose();
			}}
			class="size-8 fa-solid fa-xmark scale-150"
		/>
	</div>
	<slot name="header" />
	<div
		class="overflow-y-auto {$$slots.header ? 'max-h-safe-screen-with-header' : 'max-h-safe-screen'}"
	>
		<slot />
	</div>
</div>
