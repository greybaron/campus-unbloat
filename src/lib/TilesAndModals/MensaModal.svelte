<script lang="ts">
	import DashboardModal from '$lib/DashboardModal.svelte';
	import type { SvelteComponent } from 'svelte';
	export let parent: SvelteComponent;
</script>

<DashboardModal bind:parent title="Mensa">
	<svelte:fragment slot="body">
		<p>das essen halt</p>
	</svelte:fragment>
	<svelte:fragment slot="optionalbuttons"></svelte:fragment>
</DashboardModal>
