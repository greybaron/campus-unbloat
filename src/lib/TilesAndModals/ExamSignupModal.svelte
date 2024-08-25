<script lang="ts">
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
	import { onMount, type SvelteComponent } from 'svelte';

	import {
		getToastSettings,
		SignupOrVerfahren,
		ToastPayloadClass,
		type CampusDualSignupOption,
		type CampusDualVerfahrenOption,
		type ToastPayload
	} from '$lib/types';
	import DashboardModal from '$lib/DashboardModal.svelte';
	import ExamSignupAccordion from '$lib/ExamSignup/ExamSignupAccordion.svelte';

	export let parent: SvelteComponent;
	export let signupOptions: Array<CampusDualSignupOption>;
	export let onExamSignupOrCancel: () => void;

	const toastStore = getToastStore();

	let verfahrenOptions: Array<CampusDualVerfahrenOption>;
	let signupOrVerfahren = SignupOrVerfahren.signup;

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
</script>

<DashboardModal bind:parent title="Prüfungen">
	<svelte:fragment slot="header">
		<div class="flex justify-center">
			<RadioGroup active="variant-filled-primary" hover="hover:variant-soft-primary">
				<RadioItem bind:group={signupOrVerfahren} name="radio" value={SignupOrVerfahren.signup}
					>Anmeldung</RadioItem
				>
				<RadioItem bind:group={signupOrVerfahren} name="radio" value={SignupOrVerfahren.verfahren}
					>Abmeldung</RadioItem
				>
			</RadioGroup>
		</div>
	</svelte:fragment>

	{#if signupOrVerfahren === SignupOrVerfahren.signup}
		<ExamSignupAccordion data={signupOptions} {signupOrVerfahren} {onExamSignupOrCancel}
		></ExamSignupAccordion>
	{:else}
		<ExamSignupAccordion data={verfahrenOptions} {signupOrVerfahren} {onExamSignupOrCancel}
		></ExamSignupAccordion>
	{/if}
</DashboardModal>
