<script lang="ts">
	import { Accordion, AccordionItem, getModalStore } from '@skeletonlabs/skeleton';
	import {
		getToastSettings,
		SignupOrVerfahren,
		ToastPayloadClass,
		type CampusDualSignupOption,
		type CampusExamMetadata,
		type ToastPayload
	} from './types';

	export let data: Array<CampusDualSignupOption>;
	export let signupOrVerfahren: SignupOrVerfahren;
	export let signalStore: Writable<boolean>;

	import { getToastStore } from '@skeletonlabs/skeleton';
	import type { Writable } from 'svelte/store';

	const toastStore = getToastStore();
	const modalStore = getModalStore();

	async function startExamSignup(internal_metadata?: CampusExamMetadata) {
		let url =
			signupOrVerfahren === SignupOrVerfahren.signup ? '/api/registerexam' : '/api/cancelexam';
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(internal_metadata)
		});

		let toastPayload: ToastPayload;

		if (!response.ok) {
			toastPayload = {
				text: await response.text(),
				class: ToastPayloadClass.error
			};
		} else {
			let resp_text = await response.text();
			if (resp_text === '{}') {
				toastPayload = {
					text: 'Erfolgreich angemeldet',
					class: ToastPayloadClass.success
				};
			} else {
				toastPayload = {
					text: resp_text,
					class: ToastPayloadClass.error
				};
			}
		}

		modalStore.clear();
		const toastSettings = getToastSettings(toastPayload);
		toastStore.trigger(toastSettings);
		signalStore.set(true);
	}
</script>

<Accordion>
	{#if data}
		{#each data as signup}
			<AccordionItem open>
				<svelte:fragment slot="lead">
					<span
						class="badge-icon p-4 {signup.status == '📝'
							? 'variant-filled-secondary'
							: signup.status == '🚫'
								? 'variant-filled-surface'
								: ' variant-filled-warning'}"><p class="text-lg">{signup.status}</p></span
					>
				</svelte:fragment>
				<svelte:fragment slot="summary"
					>{signup.name} ({signup.verfahren}, {signup.pruefart})</svelte:fragment
				>
				<svelte:fragment slot="content">
					<div class="w-full text-token card p-2 space-y-4">
						<dl class="list-dl">
							{#if signup.exam_time && signup.exam_date}
								<div>
									<span class="badge-icon p-4 variant-soft-secondary"
										><i class="fa-solid fa-calendar"></i></span
									>
									<span class="flex-auto">
										<dt class="font-bold">
											{signup.exam_date}, {signup.exam_time}{signup.exam_room
												? `, ${signup.exam_room}`
												: ''}
										</dt>
									</span>
								</div>
							{/if}
							{#if signup.signup_information}
								<div>
									<span class="badge-icon p-4 variant-soft-secondary"
										><i class="fa-solid fa-info"></i></span
									>
									<span class="flex-auto">
										<dt class="font-bold">{signup.signup_information}</dt>
									</span>
								</div>
							{/if}
							{#if signup.warning_message}
								<div>
									<span class="badge-icon p-4 variant-soft-secondary"
										><i class="fa-solid fa-info"></i></span
									>
									<span class="flex-auto">
										<dt class="font-bold">{signup.warning_message}</dt>
									</span>
								</div>
							{/if}
							{#if signup.internal_metadata}
								<div class="flex justify-center">
									<button
										on:click={() => {
											startExamSignup(signup.internal_metadata);
										}}
										class="variant-ghost-primary btn"
									>
										{signupOrVerfahren == SignupOrVerfahren.signup
											? 'Zur Prüfung anmelden'
											: 'Von Prüfung abmelden'}
									</button>
								</div>
							{/if}
						</dl>
					</div>
				</svelte:fragment>
			</AccordionItem>
		{/each}
	{/if}
</Accordion>
