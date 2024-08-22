<script lang="ts">
	import DashboardTile from '$lib/DashboardTile.svelte';
	import {
		ConicGradient,
		getModalStore,
		type ConicStop,
		type ModalComponent,
		type ModalSettings
	} from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	let conicStops: ConicStop[];

	import GradesModal from '$lib/TilesAndModals/GradesModal.svelte';

	let modalStore = getModalStore();
	let modalComponent: ModalComponent;
	let modal: ModalSettings;

	let stats: ExamStats;
	let grades: Array<CampusDualGrade>;

	import { createEventDispatcher } from 'svelte';
	import {
		ToastPayloadClass,
		type CampusDualGrade,
		type ExamStats,
		type ToastPayload
	} from '$lib/types';
	import type { Writable } from 'svelte/store';
	import { persistentStore } from '$lib/TSHelpers/LocalStorageHelper';
	const dispatch = createEventDispatcher();

	let gradesCountStore: Writable<number>;

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

		let total = stats.successful + stats.unsuccessful + stats.unassessed;
		if (total === 0) {
			conicStops = [{ color: 'rgba(0,0,255,1)', start: 0, end: 100 }];
		} else {
			let success_ratio = stats.successful / total;
			let unsuccessful_ratio = success_ratio + stats.unsuccessful / total;

			conicStops = [
				{
					label: 'Erfolg',
					color: 'rgb(var(--color-secondary-500))',
					start: 0,
					end: success_ratio * 100
				},
				{
					label: '5.0 Abfahrt',
					color: 'rgb(var(--color-primary-500))',
					start: success_ratio * 100,
					end: unsuccessful_ratio * 100
				}
			];

			if (stats.unassessed > 0) {
				conicStops.push({
					label: 'Ausstehend',
					color: 'rgba(255,255,255,0.5)',
					start: unsuccessful_ratio * 100,
					end: 100
				});
			}
		}
	});

	function openModal() {
		gradesCountStore.set(grades.length);
		modalStore.trigger(modal);
	}
</script>

<DashboardTile title="Noten" on:click={openModal} ready={Boolean(conicStops && grades)}>
	{#if $gradesCountStore != grades.length}
		<div class="w-full flex justify-end">
			<span class="badge variant-filled-secondary relative -top-8 left-2 rounded-xl -mb-6"
				>Neue Noten</span
			>
		</div>
	{/if}
	<ConicGradient stops={conicStops} legend></ConicGradient>
</DashboardTile>
