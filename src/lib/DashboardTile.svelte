<script lang="ts">
	// import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';

	export let title: string;
	export let clickable: boolean = true;
	// export let modalName: string;
	// export let any_tile_open: boolean;
	// let this_tile_open = false;
	// let container;

	// import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
	// const modalStore = getModalStore();

	// import MyTest from '$lib/DashboardModal.svelte';
	// const myComponent = { ref: MyTest };

	// // // const modal: ModalSettings = {
	// // // 	type: 'component',
	// // // 	// title: title,
	// // // 	component: modalName
	// // // 	// component: 'gradesModal',
	// // // };
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	// on:click={() => modalStore.trigger(modal)}
</script>

<button
	on:click={() => dispatch('click')}
	class="{clickable
		? ''
		: 'pointer-events-none'} transition-all variant-glass-primary flex flex-col items-center w-80 rounded-xl p-2 pt-1 space-y-1"
>
	<header class="pl-2 text-xl font-bold text-left">{title}</header>
	<hr />
	<slot name="body" />
</button>
