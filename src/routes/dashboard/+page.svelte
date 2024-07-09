<script lang="ts">
	import PageContainer from '$lib/PageContainer.svelte';
	import BasicInfoTile from '$lib/TilesAndModals/BasicInfoTile.svelte';
	import ExamSignupTile from '$lib/TilesAndModals/ExamSignupTile.svelte';
	import GradesTile from '$lib/TilesAndModals/GradesTile.svelte';
	import MensiTile from '$lib/TilesAndModals/MensiTile.svelte';

	import { onMount } from 'svelte';
	export let data;

	let deser_data: {
		first_name: string;
		last_name: string;
		seminar_group: string;
		seminar_name: string;
		user: string;
	};

	onMount(() => {
		deser_data = JSON.parse(data.user_basic!);
	});
</script>

<PageContainer>
	{#if deser_data}
		<h1 class="text-3xl font-bold pl-4">Hallo, {deser_data.first_name}.</h1>
	{/if}
	<div class="transition-all grid grid-cols-1 md:grid-cols-2 gap-4 mx-auto">
		<BasicInfoTile basic_data={deser_data} />
		<GradesTile />
		<ExamSignupTile />
		<MensiTile />
	</div>
	<!-- <DashboardTile title="Meine Kurse" bind:any_tile_open />
	<DashboardTile title="Meine Noten" bind:any_tile_open /> -->
	<!-- {#if deser_data}
		<h1>Grüße {deser_data.first_name} {deser_data.last_name} ({deser_data.user})</h1>
		<p>Seminargruppe: {deser_data.seminar_group} - {deser_data.seminar_name}</p>
	{/if} -->
</PageContainer>
