<script lang="ts">
	import {
		getModalStore,
		getToastStore,
		getDrawerStore,
		ProgressRadial,
		type DrawerSettings,
		type ModalComponent,
		type ModalSettings
	} from '@skeletonlabs/skeleton';
	import { onMount, type ComponentType } from 'svelte';
	import type { Writable } from 'svelte/store';
	import Portal from 'svelte-portal';

	import {
		getToastSettings,
		ToastPayloadClass,
		type BasicUserData,
		type CdReminders,
		type ToastPayload
	} from '$lib/types';
	import { persistentStore } from '$lib/TSHelpers/LocalStorageHelper';
	import { components, validateComponentOrder } from '$lib/TSHelpers/ComponentOrder.js';

	import PageContainer from '$lib/PageContainer.svelte';
	import BasicInfoTile from '$lib/TilesAndModals/BasicInfoTile.svelte';
	import CalendarTile from '$lib/TilesAndModals/CalendarTile.svelte';
	import ExamSignupTile from '$lib/TilesAndModals/ExamSignupTile.svelte';
	import GradesTile from '$lib/TilesAndModals/GradesTile.svelte';
	import MensaTile from '$lib/TilesAndModals/MensaTile.svelte';
	import BlockplanTile from '$lib/TilesAndModals/BlockplanTile.svelte';
	import DashReorderModal from '$lib/TilesAndModals/DashReorderModal.svelte';
	import { every as _every, some as _some, isEqual as _isEqual } from 'lodash-es';

	export let data;

	const toastStore = getToastStore();
	const drawerStore = getDrawerStore();
	const componentMap: Record<string, ComponentType> = {
		BasicInfoTile,
		GradesTile,
		CalendarTile,
		MensaTile,
		ExamSignupTile,
		BlockplanTile
	};

	let basicUserData: BasicUserData = JSON.parse(data.user_basic!);

	let componentOrder: Writable<string[]>;
	let componentProps: Record<string, object>;

	let reminders: CdReminders | null;
	let presentReminderCategories: number = 0;

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

	let modalStore = getModalStore();
	let modalComponent: ModalComponent;
	let modal: ModalSettings;
	let readRemindersStore: Writable<CdReminders>;

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

		componentProps = {
			BasicInfoTile: { basicUserData }
		};

		fetchReminders();
	});

	async function fetchReminders() {
		reminders = null;
		presentReminderCategories = 0;

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
			presentReminderCategories = getUnreadReminderCategories(reminders!);
		}
	}

	function openRemindersDrawer() {
		readRemindersStore.set(reminders!);
		presentReminderCategories = getUnreadReminderCategories(reminders!);
		const drawerSettings: DrawerSettings = {
			id: 'example-1',
			meta: { reminders: reminders }
		};
		drawerStore.open(drawerSettings);
	}

	function getUnreadReminderCategories(reminders: CdReminders): number {
		const blankCdReminders: CdReminders = {
			latest: [],
			upcoming: [],
			exams: 0,
			electives: 0,
			semester: 0
		};

		readRemindersStore = persistentStore('readReminders', blankCdReminders);
		const readReminders = $readRemindersStore;

		let presentReminderCategories = 0;

		if (!allItemsPresentInSecondDeep(reminders.latest, readReminders.latest))
			presentReminderCategories++;
		if (!allItemsPresentInSecondDeep(reminders.upcoming, readReminders.upcoming))
			presentReminderCategories++;
		if (reminders.exams > 0 && reminders.exams != readReminders.exams) presentReminderCategories++;
		if (
			reminders.semester <= 6 &&
			reminders.electives != 0 &&
			reminders.electives != readReminders.electives
		) {
			presentReminderCategories++;
		}

		return presentReminderCategories;
	}

	function allItemsPresentInSecondDeep(list1: object[], list2: object[]): boolean {
		return _every(list1, (item) => _some(list2, (item2) => _isEqual(item, item2)));
	}

	function openTileReorder() {
		modalStore.trigger(modal);
	}
</script>

<PageContainer>
	{#if basicUserData}
		<div class="w-[98%] sm:w-96 lg:w-[48.6rem] mx-auto space-x-1 flex items-center">
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<h1 class="text-3xl font-bold flex-grow" on:click={() => {}}>
				Hallo, {basicUserData.first_name}.
			</h1>

			<button
				aria-label="Anordnung ändern"
				on:click={openTileReorder}
				class="transition-none btn-icon variant-filled-secondary"
			>
				<i class="fa-solid fa-up-down-left-right"></i>
			</button>

			<div class="relative inline-block">
				{#if presentReminderCategories != 0}
					<span class="size-6 badge-icon variant-filled-secondary absolute -top-1 -right-1 z-10"
						>{presentReminderCategories}</span
					>
				{/if}
				<button
					aria-label="Benachrichtigungen"
					on:click={openRemindersDrawer}
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
		<div class="w-[98%] sm:w-auto grid grid-cols-1 lg:grid-cols-2 gap-3 mx-auto">
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
						on:updateReminders={fetchReminders}
					/>
				</Portal>
			{/each}
		</div>
	{/if}
</PageContainer>
