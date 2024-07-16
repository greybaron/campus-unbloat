<script lang="ts">
	import DashboardModal from '$lib/DashboardModal.svelte';
	import { onMount } from 'svelte';
	export let mensaList: Array<{ id: number; name: string }>;

	onMount(() => {
		console.log(mensaList);
	});

	// async () => {
	// 	console.log('Fetching stats...');
	// }
</script>

<DashboardModal title="Mensa">
	<svelte:fragment slot="body">
		<p>das essen halt</p>
	</svelte:fragment>
	<svelte:fragment slot="optionalbuttons"></svelte:fragment>
</DashboardModal>
