<script lang="ts">
	import DashboardTile from '$lib/DashboardTile.svelte';
	import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import CalendarModal from './CalendarModal.svelte';

	let modalStore = getModalStore();
	let modalComponent: ModalComponent;
	let modal: ModalSettings;

	let calendar: Array<{
        title: string,
        start: number,
        end: number,
        allDay: boolean,
        description: string,
        color: string,
        editable: boolean,
        room: string,
        sroom: string,
        instructor: string,
        sinstructor: string,
        remarks: string
    }>;

	onMount(async () => {

		modalComponent = {
			ref: CalendarModal,
			//props: { stats: calendar }
		};

		modal = {
			type: 'component',
			component: modalComponent
		};

		const res = await fetch('/api/stundenplan');
		if (!res.ok) {
			return { props: { error: res.status } };
		}
		calendar = await res.json();
        console.log(calendar);
	});

	function openModal() {
		modalStore.trigger(modal);
	}
</script>

<DashboardTile title="Kalender" on:click={openModal}>
	<svelte:fragment slot="body">
		{#if calendar}
			<p>Kalender zack bumm schuss</p>
            <p>{calendar[0].title}</p>
		{/if}
	</svelte:fragment>
</DashboardTile>
