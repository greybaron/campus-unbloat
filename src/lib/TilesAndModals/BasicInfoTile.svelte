<script lang="ts">
	import DashboardTile from '$lib/DashboardTile.svelte';
	import { onMount } from 'svelte';
	export let basic_data: {
		first_name: string;
		last_name: string;
		seminar_group: string;
		seminar_name: string;
		user: string;
	};

	let fachsemester: string;
	let ects: string;

	onMount(async () => {
		const res1 = await fetch('/api/getects');
		if (!res1.ok) {
			return { props: { error: res1.status } };
		}
		ects = await res1.text();

		const res2 = await fetch('/api/getfachsem');
		if (!res2.ok) {
			return { props: { error: res2.status } };
		}
		fachsemester = await res2.text();
	});
</script>

<DashboardTile
	title="Daten zur Person"
	clickable={false}
	ready={Boolean(basic_data && fachsemester && ects)}
>
	<svelte:fragment slot="body">
		{#if basic_data}
			<div class="flex flex-col h-full justify-center space-y-2">
				<p>{basic_data.user} - {basic_data.last_name}, {basic_data.first_name}</p>
				<p>{basic_data.seminar_group} - {basic_data.seminar_name}</p>
			</div>
		{/if}
		{#if fachsemester}
			<p>Fachsemester: {fachsemester}</p>
		{/if}
		{#if ects}
			<p>ECTS: {ects} / 180</p>
		{/if}
	</svelte:fragment>
</DashboardTile>
