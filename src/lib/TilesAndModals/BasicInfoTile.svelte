<script lang="ts">
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import { onMount, createEventDispatcher } from 'svelte';

	import DashboardTile from '$lib/DashboardTile.svelte';
	import { ToastPayloadClass, type BasicUserData, type ToastPayload } from '$lib/types';

	export let basicUserData: BasicUserData;

	const dispatch = createEventDispatcher();

	let fachsemester: string;
	let ects: string;

	onMount(async () => {
		const res1 = await fetch('/api/getects');

		if (res1.ok) {
			ects = await res1.json();
		} else {
			let error = await res1.text();

			let payload: ToastPayload = {
				text: error,
				class: ToastPayloadClass.error
			};

			dispatch('showToast', payload);
		}

		const res2 = await fetch('/api/getfachsem');

		if (res2.ok) {
			fachsemester = await res2.text();
		} else {
			let error = await res2.text();

			let payload: ToastPayload = {
				text: error,
				class: ToastPayloadClass.error
			};

			dispatch('showToast', payload);
		}
	});
</script>

<DashboardTile
	title="Deine Infos"
	clickable={false}
	ready={Boolean(basicUserData && fachsemester && ects)}
>
	<div class="w-full space-y-2 h-full max-h-44 min-h-32 flex flex-col justify-between">
		<div class="flex-grow" />
		{#if basicUserData}
			<p>{basicUserData.user} - {basicUserData.seminar_group}</p>
			<p>{basicUserData.seminar_name}</p>
		{/if}
		<div class="flex-grow" />
		{#if fachsemester && ects}
			<div class="flex space-x-2">
				<div class="card rounded-xl w-full p-2 space-y-2 justify-center flex flex-col">
					<small id="fachsem">Fachsemester: {fachsemester}</small>
					<ProgressBar labelledby="fachsem" value={parseInt(fachsemester)} max={6} />
				</div>
				<div class="card rounded-xl w-full p-2 space-y-2 justify-center flex flex-col">
					<small id="ects">ECTS: {ects} / 180</small>
					<ProgressBar labelledby="ects" value={parseInt(ects)} max={180} />
				</div>
			</div>
		{/if}
	</div>
</DashboardTile>
