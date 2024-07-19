<script lang="ts">
	import PageContainer from '$lib/PageContainer.svelte';
	import BasicInfoTile from '$lib/TilesAndModals/BasicInfoTile.svelte';
	import CalendarTile from '$lib/TilesAndModals/CalendarTile.svelte';
	import ExamSignupTile from '$lib/TilesAndModals/ExamSignupTile.svelte';
	import GradesTile from '$lib/TilesAndModals/GradesTile.svelte';
	import MensaTile from '$lib/TilesAndModals/MensaTile.svelte';

	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();
	import { ToastPayloadClass, type BasicUserData, type ToastPayload } from '$lib/types.js';
	import { onMount } from 'svelte';

	export let data;

	let deserData: BasicUserData;

	onMount(async () => {
		deserData = JSON.parse(data.user_basic!);
		const res = await fetch('/api/check_session_alive');

		if (!res.ok) {
			let error = await res.text();
			let payload: ToastPayload = {
				text: error,
				class: ToastPayloadClass.error
			};

			showToast(payload);
		} else {
			let alive: boolean = await res.json();

			if (!alive) {
				await fetch('/logout');
			}
		}
	});

	function showToast(payload: ToastPayload) {
		let bg: string;
		switch (payload.class) {
			case ToastPayloadClass.success:
				bg = 'variant-filled-success';
				bg = '';
				break;
			case ToastPayloadClass.warn:
				bg = 'variant-filled-warning';
				break;
			case ToastPayloadClass.error:
				bg = 'variant-filled-error';
				break;
		}
		if (payload.class == ToastPayloadClass.error) {
			const t: ToastSettings = {
				message: payload.text,
				background: bg,
				autohide: false
			};
			toastStore.trigger(t);
		} else {
			const t: ToastSettings = {
				message: payload.text,
				background: bg,
				timeout: 10000
			};
			toastStore.trigger(t);
		}
	}
</script>

<PageContainer>
	{#if deserData}
		<h1 class="text-3xl font-bold pl-4">Hallo, {deserData.firstName}.</h1>
	{/if}
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mx-auto">
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
