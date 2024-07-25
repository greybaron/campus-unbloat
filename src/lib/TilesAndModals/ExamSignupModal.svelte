<script lang="ts">
	import DashboardModal from '$lib/DashboardModal.svelte';
	import {
		getToastSettings,
		SignupOrVerfahren,
		ToastPayloadClass,
		type CampusDualSignupOption,
		type CampusDualVerfahrenOption,
		type ToastPayload
	} from '$lib/types';

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
	import { onMount, type SvelteComponent } from 'svelte';
	import ExamSignupAccordion from '$lib/ExamSignupAccordion.svelte';
	import type { Writable } from 'svelte/store';

	export let parent: SvelteComponent;
	export let signupOptions: Array<CampusDualSignupOption>;
	export let signalStore: Writable<boolean>;

	let verfahrenOptions: Array<CampusDualVerfahrenOption>;

	onMount(async () => {
		let res = await fetch('/api/examverfahren');
		if (!res.ok) {
			let error = await res.text();
			let toastPayload: ToastPayload = {
				text: error,
				class: ToastPayloadClass.error
			};
			let toastSettings = getToastSettings(toastPayload);
			toastStore.trigger(toastSettings);
		} else {
			verfahrenOptions = await res.json();
		}
	});

	let signupOrVerfahren = SignupOrVerfahren.signup;
</script>

<DashboardModal bind:parent title="Prüfungen">
	<div class="flex flex-col items-center">
		<RadioGroup active="variant-filled-primary" hover="hover:variant-soft-primary">
			<RadioItem bind:group={signupOrVerfahren} name="radio" value={SignupOrVerfahren.signup}
				>Anmeldung</RadioItem
			>
			<RadioItem bind:group={signupOrVerfahren} name="radio" value={SignupOrVerfahren.verfahren}
				>Verfahren</RadioItem
			>
		</RadioGroup>
	</div>
	{#if signupOrVerfahren === SignupOrVerfahren.signup}
		<ExamSignupAccordion data={signupOptions} {signupOrVerfahren} {signalStore}
		></ExamSignupAccordion>
	{:else}
		<ExamSignupAccordion data={verfahrenOptions} {signupOrVerfahren} {signalStore}
		></ExamSignupAccordion>
	{/if}
	<svelte:fragment slot="optionalbuttons"></svelte:fragment>
</DashboardModal>
