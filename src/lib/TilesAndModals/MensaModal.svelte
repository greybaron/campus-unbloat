<script lang="ts">
	import DashboardModal from '$lib/DashboardModal.svelte';
	import type { SvelteComponent } from 'svelte';
	export let parent: SvelteComponent;
</script>

<DashboardModal bind:parent title="Mensa">
	<p>das essen halt</p>
</DashboardModal>
