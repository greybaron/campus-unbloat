<script lang="ts">
	import PageContainer from '$lib/PageContainer.svelte';
	import BasicInfoTile from '$lib/TilesAndModals/BasicInfoTile.svelte';
	import CalendarTile from '$lib/TilesAndModals/CalendarTile.svelte';
	import ExamSignupTile from '$lib/TilesAndModals/ExamSignupTile.svelte';
	import GradesTile from '$lib/TilesAndModals/GradesTile.svelte';
	import MensaTile from '$lib/TilesAndModals/MensaTile.svelte';

	import { onMount } from 'svelte';
	export let data;

	let deser_data: {
		first_name: string;
		last_name: string;
		seminar_group: string;
		seminar_name: string;
		user: string;
	};

	onMount(async () => {
		deser_data = JSON.parse(data.user_basic!);
		const res = await fetch('/api/check_session_alive');
		let alive: boolean = await res.json();

		if (!alive) {
			await fetch('/logout');
		}
	});
</script>

<PageContainer>
	{#if deser_data}
		<h1 class="text-3xl font-bold pl-4">Hallo, {deser_data.first_name}.</h1>
	{/if}
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mx-auto">
		<BasicInfoTile basic_data={deser_data} />
		<GradesTile />
		<ExamSignupTile />
		<MensaTile />
		<CalendarTile />
	</div>
</PageContainer>
