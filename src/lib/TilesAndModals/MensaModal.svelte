<script lang="ts">
	import DashboardModal from '$lib/DashboardModal.svelte';
</script>

<DashboardModal title="Mensa">
	<svelte:fragment slot="body">
		<p>das essen halt</p>
	</svelte:fragment>
	<svelte:fragment slot="optionalbuttons"></svelte:fragment>
</DashboardModal>
