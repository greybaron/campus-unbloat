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

	let conicStops: ConicStop[] = [{ color: 'rgba(255,255,255,.8)', start: 0, end: 10 }];

	import GradesModal from '$lib/TilesAndModals/GradesModal.svelte';

	let modalStore = getModalStore();
	let modalComponent: ModalComponent;
	let modal: ModalSettings;

	// { color: 'rgba(255,255,255,0.5)', start: 10, end: 35 },

	let stats: {
		total: number;
		successful: number;
		unsuccessful: number;
		unassessed: number;
		booked: number;
		finished: number;
		ronmodus: number;
	};

	onMount(async () => {
		console.log('Fetching stats...');
		const res = await fetch('/api/examstats');

		if (!res.ok) {
			return { props: { error: res.status } };
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

<DashboardTile title="Noten" on:click={openModal}>
	<svelte:fragment slot="body">
		<ConicGradient stops={conicStops} legend></ConicGradient>
	</svelte:fragment>
</DashboardTile>
