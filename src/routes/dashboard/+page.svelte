<script lang="ts">
	import PageContainer from '$lib/PageContainer.svelte';
	import BasicInfoTile from '$lib/TilesAndModals/BasicInfoTile.svelte';
	import CalendarTile from '$lib/TilesAndModals/CalendarTile.svelte';
	import ExamSignupTile from '$lib/TilesAndModals/ExamSignupTile.svelte';
	import GradesTile from '$lib/TilesAndModals/GradesTile.svelte';
	import MensaTile from '$lib/TilesAndModals/MensaTile.svelte';

	import { getToastStore, type DrawerSettings } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();
	import { getToastSettings, type BasicUserData, type ToastPayload } from '$lib/types.js';

	export let data;

	let deserData: BasicUserData = JSON.parse(data.user_basic!);

	function showToast(payload: ToastPayload) {
		const toastSettings = getToastSettings(payload);
		toastStore.trigger(toastSettings);
	}

	import { getDrawerStore } from '@skeletonlabs/skeleton';
	const drawerStore = getDrawerStore();

	function notifDrawer() {
		const drawerSettings: DrawerSettings = {
			id: 'example-1'
		};
		drawerStore.open(drawerSettings);
	}
</script>

<PageContainer>
	{#if deserData}
		<div class="w-[98%] sm:w-96 lg:w-[49rem] mx-auto flex items-center">
			<h1 class="text-3xl font-bold flex-grow">Hallo, {deserData.first_name}.</h1>
			<button on:click={notifDrawer} class="btn-icon variant-filled-primary">
				<i class="fa-solid fa-bell"></i>
			</button>
		</div>
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
