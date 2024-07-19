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

	import { createEventDispatcher } from 'svelte';
	import { ToastPayloadClass, type ExamStats, type ToastPayload } from '$lib/types';
	const dispatch = createEventDispatcher();

	onMount(async () => {
		console.log('Fetching examstats...');
		const res = await fetch('/api/examstats');

		if (!res.ok) {
			let error = await res.text();
			let payload: ToastPayload = {
				text: error,
				class: ToastPayloadClass.error
			};
			dispatch('showToast', payload);
			return;
		}

		stats = await res.json();
		modalComponent = {
			ref: GradesModal,
			props: { stats: stats }
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
		modalStore.trigger(modal);
	}
</script>

<DashboardTile title="Noten" on:click={openModal} ready={Boolean(conicStops)}>
	<svelte:fragment slot="body">
		<ConicGradient stops={conicStops} legend></ConicGradient>
	</svelte:fragment>
</DashboardTile>
