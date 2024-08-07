<script lang="ts">
	import DashboardTile from '$lib/DashboardTile.svelte';
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { ToastPayloadClass, type BasicUserData, type ToastPayload } from '$lib/types.js';

	export let basicUserData: BasicUserData;

	let fachsemester: string;
	let ects: string;

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

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
	add_class="pointer-events-none"
	ready={Boolean(basicUserData && fachsemester && ects)}
>
	<div class="h-full flex flex-col justify-around items-center">
		{#if basicUserData}
			<p>{basicUserData.user} - {basicUserData.seminar_group}</p>
			<p>{basicUserData.seminar_name}</p>
		{/if}
		{#if fachsemester && ects}
			<div class="flex w-full justify-evenly space-x-12">
				<small>Fachsemester: {fachsemester}</small>
				<small>ECTS: {ects} / 180</small>
			</div>
			<div class="flex w-full justify-between space-x-2">
				<ProgressBar value={parseInt(fachsemester)} max={6} />
				<ProgressBar value={parseInt(ects)} max={180} />
			</div>
		{/if}
	</div>
</DashboardTile>
