<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	export let title: string;
	export let parent: SvelteComponent;
</script>

<div
	class="modal block overflow-y-auto bg-surface-100-800-token w-modal h-auto p-4 space-y-4 rounded-container-token shadow-xl"
	role="dialog"
>
	<div class="flex w-full items-center">
		<header class="flex-grow text-2xl font-bold">{title}</header>
		<button
			on:click={() => {
				parent.onClose();
			}}
			class="size-8 fa-solid fa-xmark scale-150"
		/>
	</div>
	<slot name="body" />
	<footer class="modal-footer flex justify-end space-x-2">
		<slot name="optionalbuttons" />
	</footer>
</div>
