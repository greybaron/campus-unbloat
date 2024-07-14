<script lang="ts">
	import DashboardTile from '$lib/DashboardTile.svelte';
	import { onMount } from 'svelte';

	import ExamSignupModal from './ExamSignupModal.svelte';
	import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';

	let modalStore = getModalStore();
	let modalComponent: ModalComponent;
	let modal: ModalSettings;

	let signup_ops: Array<{ name: string; verfahren: string; status: string }>;
	let signUppable: number;

	onMount(async () => {
		console.log('Fetching stats...');
		const res = await fetch('/api/examsignup');

		if (!res.ok) {
			return { props: { error: res.status } };
		}

		signup_ops = await res.json();
		signUppable = signup_ops.filter((op) => op.status === '📝').length;

		modalComponent = {
			ref: ExamSignupModal,
			props: { signup_ops: signup_ops }
		};

		modal = {
			type: 'component',
			component: modalComponent
		};
	});

	function openModal() {
		modalStore.trigger(modal);
	}
</script>

<DashboardTile title="Anmeldung" on:click={openModal} ready={Boolean(signup_ops)}>
	<svelte:fragment slot="body">
		{#if signup_ops}
			<p>Du kannst dich für {signUppable} Prüfungen anmelden</p>
		{/if}
	</svelte:fragment>
</DashboardTile>
