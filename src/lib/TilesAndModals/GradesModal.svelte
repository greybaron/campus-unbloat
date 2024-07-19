<script lang="ts">
	import DashboardModal from '$lib/DashboardModal.svelte';
	import type { ExamStats } from '$lib/types';

	export let stats: ExamStats;
</script>

<DashboardModal title="Noten">
	<svelte:fragment slot="body">
		{#if stats}
			<p>Prüfungsversuche insgesamt: {stats.total}</p>
			<p>mit Erfolg abgeschlossen: {stats.successful}</p>
			<p>ohne Erfolg abgeschlossen: {stats.unsuccessful}</p>
			<p>noch nicht beurteilt: {stats.unassessed}</p>
			<p>gebuchte Module: {stats.booked}</p>
			<p>abgeschlossene Module: {stats.finished}</p>
		{/if}
	</svelte:fragment>
	<svelte:fragment slot="optionalbuttons"></svelte:fragment>
</DashboardModal>
