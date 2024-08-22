<script lang="ts">
	import DashboardTile from '$lib/DashboardTile.svelte';
	import { onMount } from 'svelte';

	import ExamSignupModal from './ExamSignupModal.svelte';
	import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';

	let modalStore = getModalStore();
	let modalComponent: ModalComponent;
	let modal: ModalSettings;

	let signupOptions: Array<CampusDualSignupOption> | null;
	let signUppable: number;

	import { createEventDispatcher } from 'svelte';
	import { ToastPayloadClass, type CampusDualSignupOption, type ToastPayload } from '$lib/types';
	const dispatch = createEventDispatcher();

	async function fetchStuff() {
		signupOptions = null;

		const res1 = await fetch('/api/examsignup');

		if (!res1.ok) {
			let error = await res1.text();

			let payload: ToastPayload = {
				text: error,
				class: ToastPayloadClass.error
			};

			dispatch('showToast', payload);
		} else {
			signupOptions = await res1.json();
			signUppable = signupOptions!.filter((op) => op.status === '📝').length;
		}

		modalComponent = {
			ref: ExamSignupModal,
			props: {
				signupOptions: signupOptions,
				onExamSignupOrCancel: examSignupOrCancel
			}
		};

		modal = {
			type: 'component',
			component: modalComponent
		};
	}

	async function examSignupOrCancel() {
		dispatch('updateReminders');
		await fetchStuff();
	}

	onMount(async () => {
		fetchStuff();
	});

	function openModal() {
		modalStore.trigger(modal);
	}
</script>

<DashboardTile title="Prüfungen" on:click={openModal} ready={Boolean(signupOptions)}>
	<svelte:fragment>
		{#if signUppable || signUppable === 0}
			Du kannst dich für <p class="font-bold">
				{signUppable} Prüfung{signUppable != 1 ? 'en' : ''}
			</p>
			anmelden.
			<p class="text-2xl pt-2">{signUppable === 0 ? '✅' : '⚠️'}</p>
		{/if}
	</svelte:fragment>
</DashboardTile>
