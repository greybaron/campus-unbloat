<script lang="ts">
	import DashboardTile from '$lib/DashboardTile.svelte';
	import { onMount } from 'svelte';

	import ExamSignupModal from './ExamSignupModal.svelte';
	import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';

	let modalStore = getModalStore();
	let modalComponent: ModalComponent;
	let modal: ModalSettings;

	let signupOptions: Array<ExamSignup>;
	let signUppable: number;

	import { createEventDispatcher } from 'svelte';
	import { ToastPayloadClass, type ExamSignup, type ToastPayload } from '$lib/types';
	const dispatch = createEventDispatcher();

	onMount(async () => {
		console.log('Fetching examsignup...');
		const res = await fetch('/api/examsignup');

		if (!res.ok) {
			let error = await res.text();

			let payload: ToastPayload = {
				text: error,
				class: ToastPayloadClass.error
			};

			dispatch('showToast', payload);
		} else {
			signupOptions = await res.json();
			signUppable = signupOptions.filter((op) => op.status === '📝').length;
		}

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
