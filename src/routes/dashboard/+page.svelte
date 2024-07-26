<script lang="ts">
	import PageContainer from '$lib/PageContainer.svelte';
	import BasicInfoTile from '$lib/TilesAndModals/BasicInfoTile.svelte';
	import CalendarTile from '$lib/TilesAndModals/CalendarTile.svelte';
	import ExamSignupTile from '$lib/TilesAndModals/ExamSignupTile.svelte';
	import GradesTile from '$lib/TilesAndModals/GradesTile.svelte';
	import MensaTile from '$lib/TilesAndModals/MensaTile.svelte';

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();
	import { getToastSettings, type BasicUserData, type ToastPayload } from '$lib/types.js';
	import { onMount } from 'svelte';

	export let data;

	let deserData: BasicUserData;

	onMount(async () => {
		deserData = JSON.parse(data.user_basic!);
	});

	function showToast(payload: ToastPayload) {
		const toastSettings = getToastSettings(payload);
		toastStore.trigger(toastSettings);
	}
</script>

<PageContainer>
	{#if deserData}
		<h1 class="text-3xl font-bold pl-4">Hallo, {deserData.first_name}.</h1>
	{/if}
	<div class="w-[98%] sm:w-auto grid grid-cols-1 lg:grid-cols-2 gap-4 mx-auto">
		<BasicInfoTile
			basicUserData={deserData}
			on:showToast={(e) => {
				showToast(e.detail);
			}}
		/>
		<GradesTile
			on:showToast={(e) => {
				showToast(e.detail);
			}}
		/>
		<ExamSignupTile
			on:showToast={(e) => {
				showToast(e.detail);
			}}
		/>
		<MensaTile
			on:showToast={(e) => {
				showToast(e.detail);
			}}
		/>
		<CalendarTile
			on:showToast={(e) => {
				showToast(e.detail);
			}}
		/>
	</div>
</PageContainer>
