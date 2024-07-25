<script lang="ts">
	import DashboardTile from '$lib/DashboardTile.svelte';
	import { onMount } from 'svelte';
	import { type Writable } from 'svelte/store';

	import ExamSignupModal from './ExamSignupModal.svelte';
	import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';

	let modalStore = getModalStore();
	let modalComponent: ModalComponent;
	let modal: ModalSettings;

	let signupOptions: Array<CampusDualSignupOption> | undefined;
	let signUppable: number;

	import { createEventDispatcher } from 'svelte';
	import { ToastPayloadClass, type CampusDualSignupOption, type ToastPayload } from '$lib/types';
	import { persistentStore } from '$lib/TSHelpers/LocalStorageHelper';
	const dispatch = createEventDispatcher();

	export async function fetchStuff() {
		signupOptions = undefined;
		signalStore.set(false);

		console.log('Fetching examsignup...');
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
			props: { signupOptions: signupOptions, signalStore: signalStore }
		};

		modal = {
			type: 'component',
			component: modalComponent
		};
	}

	let signalStore: Writable<boolean>;
	$: if ($signalStore) fetchStuff();

	onMount(async () => {
		signalStore = persistentStore('signal', false);
		fetchStuff();
	});

	function openModal() {
		modalStore.trigger(modal);
	}
</script>

<DashboardTile title="Prüfungen" on:click={openModal} ready={Boolean(signupOptions)}>
	<svelte:fragment slot="body">
		{#if signUppable || signUppable === 0}
			Du kannst dich für <p class="font-bold">
				{signUppable} Prüfung{signUppable != 1 ? 'en' : ''}
			</p>
			anmelden.
		{/if}
	</svelte:fragment>
</DashboardTile>
