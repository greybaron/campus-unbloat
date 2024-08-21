<script lang="ts">
	import PageContainer from '$lib/PageContainer.svelte';
	import BasicInfoTile from '$lib/TilesAndModals/BasicInfoTile.svelte';
	import CalendarTile from '$lib/TilesAndModals/CalendarTile.svelte';
	import ExamSignupTile from '$lib/TilesAndModals/ExamSignupTile.svelte';
	import GradesTile from '$lib/TilesAndModals/GradesTile.svelte';
	import MensaTile from '$lib/TilesAndModals/MensaTile.svelte';
	import BlockplanTile from '$lib/TilesAndModals/BlockplanTile.svelte';

	import {
		getModalStore,
		getToastStore,
		ProgressRadial,
		type DrawerSettings,
		type ModalComponent,
		type ModalSettings
	} from '@skeletonlabs/skeleton';
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

	function showToast(data: ToastPayload | CustomEvent) {
		let payload: ToastPayload;

		if (data instanceof CustomEvent) {
			payload = data.detail;
		} else {
			payload = data;
		}

		const toastSettings = getToastSettings(payload);
		toastStore.trigger(toastSettings);
	}

	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { persistentStore } from '$lib/TSHelpers/LocalStorageHelper';
	import type { Writable } from 'svelte/store';
	import Portal from 'svelte-portal';

	const drawerStore = getDrawerStore();

	const componentMap: Record<string, object> = {
		BasicInfoTile,
		GradesTile,
		CalendarTile,
		MensaTile,
		ExamSignupTile,
		BlockplanTile
	};
	let componentOrder: Writable<string[]>;
	let componentProps: Record<string, object>;

	let reminders: CdReminders | undefined;
	let presentNotificationCategories: number = 0;

	let remindersSignalStore: Writable<boolean>;
	$: if ($remindersSignalStore) fetchReminders();

	import DashReorderModal from '$lib/TilesAndModals/DashReorderModal.svelte';
	import { components, validateComponentOrder } from '$lib/TSHelpers/ComponentOrder.js';

	let modalStore = getModalStore();
	let modalComponent: ModalComponent;
	let modal: ModalSettings;

	onMount(async () => {
		componentOrder = persistentStore('compOrder', components);
		if (!validateComponentOrder($componentOrder)) {
			console.error('Component order is fucked, resetting');
			componentOrder.set(components);
		}

		modalComponent = {
			ref: DashReorderModal,
			props: { componentOrder: componentOrder }
		};

		modal = {
			type: 'component',
			component: modalComponent
		};

		remindersSignalStore = persistentStore('updateRemindersSignal', false);

		componentProps = {
			BasicInfoTile: { basicUserData },
			ExamSignupTile: { remindersSignalStore }
		};

		fetchReminders();
	});

	async function fetchReminders() {
		remindersSignalStore.set(false);

		reminders = undefined;
		presentNotificationCategories = 0;

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

	function openTileReorder() {
		modalStore.trigger(modal);
	}
</script>

<PageContainer>
	{#if basicUserData}
		<div class="w-[98%] sm:w-96 lg:w-[49rem] mx-auto space-x-1 flex items-center">
			<h1 class="text-3xl font-bold flex-grow">Hallo, {basicUserData.first_name}.</h1>

			<button
				aria-label="Anordnung ändern"
				on:click={openTileReorder}
				class="transition-none btn-icon variant-filled-secondary"
			>
				<i class="fa-solid fa-up-down-left-right"></i>
			</button>

			<div class="relative inline-block">
				{#if presentNotificationCategories != 0}
					<span class="size-6 badge-icon variant-filled-secondary absolute -top-1 -right-1 z-10"
						>{presentNotificationCategories}</span
					>
				{/if}
				<button
					aria-label="Benachrichtigungen"
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
	{#if componentOrder && componentProps}
		<div class="w-[98%] sm:w-auto grid grid-cols-1 lg:grid-cols-2 gap-4 mx-auto">
			<!-- create portals -->
			{#each components as _, idx}
				<span class="contents" id="portal{idx}"></span>
			{/each}

			<!-- create tiles -->
			{#each components as component}
				<Portal target="#portal{$componentOrder.indexOf(component)}">
					<svelte:component
						this={componentMap[component]}
						{...componentProps[component]}
						on:showToast={showToast}
					/>
				</Portal>
			{/each}
		</div>
	{/if}
</PageContainer>
