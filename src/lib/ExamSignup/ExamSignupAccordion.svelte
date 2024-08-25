<script lang="ts">
	import {
		Accordion,
		AccordionItem,
		getModalStore,
		popup,
		ProgressRadial,
		type PopupSettings
	} from '@skeletonlabs/skeleton';
	import { getToastStore } from '@skeletonlabs/skeleton';

	import {
		getToastSettings,
		SignupOrVerfahren,
		ToastPayloadClass,
		type CampusDualSignupOption,
		type CampusExamDetails,
		type CampusExamMetadata,
		type ToastPayload
	} from '../types';
	import ExamDetailsPopup from '../Popups/ExamDetailsPopup.svelte';

	export let data: Array<CampusDualSignupOption> | undefined;
	export let signupOrVerfahren: SignupOrVerfahren;
	export let onExamSignupOrCancel: () => void;

	const toastStore = getToastStore();
	const modalStore = getModalStore();

	let examDetails: CampusExamDetails | null = null;

	let popupOpen = false;
	const popupExamDetails: PopupSettings = {
		state(event) {
			// dirty workaround for race condition
			setTimeout(() => {
				popupOpen = event.state;
			}, 100);
		},
		event: 'click',
		target: 'popupExamDetails',
		placement: 'top'
	};

	async function getExamDetails(internal_metadata?: CampusExamMetadata) {
		if (popupOpen) return;

		examDetails = null;
		const response = await fetch('/api/examdetails', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(internal_metadata)
		});

		if (!response.ok) {
			const toastSettings = getToastSettings({
				text: await response.text(),
				class: ToastPayloadClass.error
			});
			toastStore.trigger(toastSettings);
			return;
		} else {
			examDetails = await response.json();
		}
	}

	async function startExamSignup(internal_metadata?: CampusExamMetadata) {
		// braindead approach
		data = undefined;

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
				const text =
					signupOrVerfahren === SignupOrVerfahren.signup
						? 'Erfolgreich angemeldet'
						: 'Erfolgreich abgemeldet';

				toastPayload = {
					text,
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
		onExamSignupOrCancel();
	}
</script>

<div class="card p-2 w-80 shadow-2xl" data-popup="popupExamDetails">
	<ExamDetailsPopup bind:examDetails />
</div>

<Accordion>
	{#if !data}
		<div class="flex justify-center">
			<ProgressRadial
				width="w-20"
				stroke={80}
				value={undefined}
				strokeLinecap="round"
				track="stroke-surface-500/30 dark:stroke-surface-300/30"
			/>
		</div>
	{:else if data.length == 0}
		<p class="p-4 text-lg text-center">Es gibt keine Einträge.</p>
	{:else}
		{#each data as signup}
			<AccordionItem open>
				<svelte:fragment slot="lead">
					<span
						class="badge-icon p-4 fa-solid text-white {signup.status == '📝'
							? 'variant-filled-secondary fa-pen'
							: signup.status == '🚫'
								? 'variant-filled-error saturate-200 fa-ban'
								: ' variant-filled-surface fa-question'}"
					>
					</span>
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
										class="btn-icon variant-ghost-secondary flex-shrink-0"
										use:popup={popupExamDetails}
										on:click={() => {
											getExamDetails(signup.internal_metadata);
										}}
										type="button"
									>
										<i class="fa-solid fa-info" />
									</button>

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
