<script lang="ts">
	import PageContainer from '$lib/PageContainer.svelte';
	import BasicInfoTile from '$lib/TilesAndModals/BasicInfoTile.svelte';
	import CalendarTile from '$lib/TilesAndModals/CalendarTile.svelte';
	import ExamSignupTile from '$lib/TilesAndModals/ExamSignupTile.svelte';
	import GradesTile from '$lib/TilesAndModals/GradesTile.svelte';
	import MensaTile from '$lib/TilesAndModals/MensaTile.svelte';

	import { getToastStore, ProgressRadial, type DrawerSettings } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();
	import {
		getToastSettings,
		ToastPayloadClass,
		type BasicUserData,
		type CdReminders,
		type ToastPayload
	} from '$lib/types.js';

	export let data;

	let basicUserData: BasicUserData = JSON.parse(data.user_basic!);

	function showToast(payload: ToastPayload) {
		const toastSettings = getToastSettings(payload);
		toastStore.trigger(toastSettings);
	}

	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { persistentStore } from '$lib/TSHelpers/LocalStorageHelper';
	import type { Writable } from 'svelte/store';
	const drawerStore = getDrawerStore();

	const componentMap: Record<string, any> = {
		BasicInfoTile,
		GradesTile,
		ExamSignupTile,
		MensaTile,
		CalendarTile
	};
	let componentOrder: Writable<string[]>;
	let componentProps: Record<string, any>;

	let reminders: CdReminders | undefined;
	let presentNotificationCategories: number = 0;

	let remindersSignalStore: Writable<boolean>;
	$: if ($remindersSignalStore) fetchReminders();

	onMount(async () => {
		const components: string[] = [
			'BasicInfoTile',
			'GradesTile',
			'ExamSignupTile',
			'MensaTile',
			'CalendarTile'
		];

		componentOrder = persistentStore('compOrder', components);

		componentProps = {
			BasicInfoTile: { basicUserData },
			ExamSignupTile: { remindersSignalStore }
		};

		remindersSignalStore = persistentStore('updateRemindersSignal', false);
		fetchReminders();
	});

	async function fetchReminders() {
		remindersSignalStore.set(false);

		reminders = undefined;
		presentNotificationCategories = 0;

		console.log('Fetching reminders...');
		const res = await fetch('/api/reminders');

		if (!res.ok) {
			let error = await res.text();
			let payload: ToastPayload = {
				text: error,
				class: ToastPayloadClass.error
			};

			const toastSettings = getToastSettings(payload);
			toastStore.trigger(toastSettings);
		} else {
			reminders = await res.json();
			presentNotificationCategories = getPresentNotificationCategories(reminders!);
		}
	}

	function notifDrawer() {
		const drawerSettings: DrawerSettings = {
			id: 'example-1',
			meta: { reminders: reminders }
		};
		drawerStore.open(drawerSettings);
	}

	function getPresentNotificationCategories(reminders: CdReminders): number {
		let presentNotificationCategories = 0;

		if (reminders.latest.length > 0) {
			presentNotificationCategories++;
		}

		if (reminders.upcoming.length > 0) {
			presentNotificationCategories++;
		}

		if (reminders.exams > 0) {
			presentNotificationCategories++;
		}

		if (reminders.electives > 0 && reminders.semester <= 6) {
			presentNotificationCategories++;
		}

		return presentNotificationCategories;
	}
</script>

<PageContainer>
	{#if basicUserData}
		<div class="w-[98%] sm:w-96 lg:w-[49rem] mx-auto flex items-center">
			<h1 class="text-3xl font-bold flex-grow">Hallo, {basicUserData.first_name}.</h1>
			<div class="relative inline-block">
				{#if presentNotificationCategories != 0}
					<span class="size-6 badge-icon variant-filled-secondary absolute -top-1 -right-1 z-10"
						>{presentNotificationCategories}</span
					>
				{/if}
				<button
					on:click={notifDrawer}
					class="transition-none btn-icon {reminders
						? 'variant-filled-primary'
						: 'variant-ghost-surface pointer-events-none'}"
				>
					{#if reminders}
						<i class="fa-solid fa-bell"></i>
					{:else}
						<ProgressRadial
							width="w-7"
							stroke={80}
							value={undefined}
							strokeLinecap="round"
							track="stroke-surface-500/30 dark:stroke-surface-300/30"
						/>
					{/if}
				</button>
			</div>
		</div>
	{/if}
	{#if componentOrder}
		<div class="w-[98%] sm:w-auto grid grid-cols-1 lg:grid-cols-2 gap-4 mx-auto">
			{#each $componentOrder as component}
				<svelte:component this={componentMap[component]} {...componentProps[component]} />
			{/each}
		</div>
	{/if}
</PageContainer>
