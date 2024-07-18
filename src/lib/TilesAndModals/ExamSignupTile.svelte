<script lang="ts">
	import DashboardTile from '$lib/DashboardTile.svelte';
	import { onMount } from 'svelte';

	import ExamSignupModal from './ExamSignupModal.svelte';
	import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';

	let modalStore = getModalStore();
	let modalComponent: ModalComponent;
	let modal: ModalSettings;

	type fetchedExamSignup = Array<{
		name: string;
		verfahren: string;
		status: string;
		warning_message: string;
	}>;

	let signupOptions: fetchedExamSignup;
	let signUppable: number;

	onMount(async () => {
		console.log('Fetching stats...');
		const res = await fetch('/api/examsignup');

		if (!res.ok) {
			return { props: { error: res.status } };
		}

		signupOptions = await res.json();
		signUppable = signupOptions.filter((op) => op.status === '📝').length;

		modalComponent = {
			ref: ExamSignupModal,
			props: { signupOptions: signupOptions }
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

<DashboardTile title="Anmeldung" on:click={openModal} ready={Boolean(signupOptions)}>
	<svelte:fragment slot="body">
		{#if signUppable}
			Du kannst dich für <p class="font-bold">{signUppable} Prüfungen</p>
			anmelden
		{/if}
	</svelte:fragment>
</DashboardTile>
