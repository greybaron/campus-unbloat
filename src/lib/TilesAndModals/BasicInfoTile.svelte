<script lang="ts">
	import DashboardTile from '$lib/DashboardTile.svelte';
	import { ProgressBar } from '@skeletonlabs/skeleton';
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
	title="Deine Infos"
	clickable={false}
	ready={Boolean(basic_data && fachsemester && ects)}
>
	<svelte:fragment slot="body">
		<div class="h-full flex flex-col justify-around items-center">
			{#if basic_data}
				<p>{basic_data.user} - {basic_data.seminar_group}</p>
				<p>{basic_data.seminar_name}</p>
			{/if}
			<div class="h-2" />
			{#if fachsemester && ects}
				<div class="flex w-full justify-between p-1">
					<p>Fachsemester: {fachsemester}</p>
					<p>ECTS: {ects} / 180</p>
				</div>
				<div class="flex w-full justify-between space-x-2">
					<ProgressBar value={parseInt(fachsemester)} max={6} />
					<ProgressBar value={parseInt(ects)} max={180} />
				</div>
			{/if}
		</div>
	</svelte:fragment>
</DashboardTile>
