<script lang="ts">
	import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	import type { Writable } from 'svelte/store';

	import {
		ToastPayloadClass,
		type CampusDualGrade,
		type ExamStats,
		type ToastPayload
	} from '$lib/types';
	import { persistentStore } from '$lib/TSHelpers/LocalStorageHelper';
	import DashboardTile from '$lib/DashboardTile.svelte';
	import GradesModal from '$lib/TilesAndModals/GradesModal.svelte';
	import PieChart from '$lib/Grades/PieChart.svelte';
	import ChartLabel from '$lib/Grades/ChartLabel.svelte';

	const dispatch = createEventDispatcher();

	let modalStore = getModalStore();
	let modalComponent: ModalComponent;
	let modal: ModalSettings;

	let stats: ExamStats;
	let grades: Array<CampusDualGrade>;
	let gradesCountStore: Writable<number>;
	let total: number;

	onMount(async () => {
		const res1 = await fetch('/api/examstats');

		if (!res1.ok) {
			let error = await res1.text();
			let payload: ToastPayload = {
				text: error,
				class: ToastPayloadClass.error
			};
			dispatch('showToast', payload);
			return;
		}
		stats = await res1.json();
		total = stats.successful + stats.unsuccessful + stats.unassessed;

		const res2 = await fetch('/api/grades');
		if (res2.ok) {
			grades = await res2.json();
			// always show "new grades" on first use
			gradesCountStore = persistentStore('gradesCount', 0);
		} else {
			let error = await res2.text();

			let payload: ToastPayload = {
				text: error,
				class: ToastPayloadClass.error
			};

			dispatch('showToast', payload);
		}

		modalComponent = {
			ref: GradesModal,
			props: { grades: grades }
		};

		modal = {
			type: 'component',
			component: modalComponent
		};
	});

	function openModal() {
		gradesCountStore.set(grades.length);
		modalStore.trigger(modal);
	}
</script>

<DashboardTile title="Noten" on:click={openModal} ready={Boolean(stats && grades)}>
	{#if $gradesCountStore != grades.length}
		<div class="w-full flex justify-end">
			<span class="badge variant-filled-secondary relative -top-8 left-2 rounded-xl -mb-6"
				>Neue Noten</span
			>
		</div>
	{/if}

	<PieChart {stats} />
	<div class="flex mt-4">
		<ul class="conic-list list text-sm w-full">
			{#if stats.successful > 0}
				<ChartLabel
					label="Erfolg"
					value={stats.successful}
					{total}
					color="rgb(var(--color-secondary-500))"
				/>
			{/if}
			{#if stats.unsuccessful > 0}
				<ChartLabel
					label="5.0 Abfahrt"
					value={stats.unsuccessful}
					{total}
					color="rgb(var(--color-primary-500))"
				/>
			{/if}
			{#if stats.unassessed > 0}
				<ChartLabel label="Ausstehend" value={stats.unassessed} {total} color="#c1c1c1" />
			{/if}
		</ul>
	</div>
</DashboardTile>
