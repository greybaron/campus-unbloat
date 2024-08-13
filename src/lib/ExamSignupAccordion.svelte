<script lang="ts">
	import {
		Accordion,
		AccordionItem,
		getModalStore,
		popup,
		ProgressRadial,
		type PopupSettings
	} from '@skeletonlabs/skeleton';
	import {
		getToastSettings,
		SignupOrVerfahren,
		ToastPayloadClass,
		type CampusDualSignupOption,
		type CampusExamDetails,
		type CampusExamMetadata,
		type ToastPayload
	} from './types';

	export let data: Array<CampusDualSignupOption> | undefined;
	let examDetails: CampusExamDetails | null = null;

	export let signupOrVerfahren: SignupOrVerfahren;
	export let examSignalStore: Writable<boolean>;
	export let remindersSignalStore: Writable<boolean>;

	import { getToastStore } from '@skeletonlabs/skeleton';
	import type { Writable } from 'svelte/store';

	const toastStore = getToastStore();
	const modalStore = getModalStore();

	async function getExamDetails(internal_metadata?: CampusExamMetadata) {
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
		examSignalStore.set(true);
		remindersSignalStore.set(true);
	}

	const popupExamDetails: PopupSettings = {
		event: 'click',
		target: 'popupExamDetails',
		placement: 'top'
	};
</script>

<div class="card p-2 w-80 shadow-2xl" data-popup="popupExamDetails">
	{#if !examDetails}
		<div class="flex h-56 items-center justify-center">
			<ProgressRadial
				width="w-20"
				stroke={80}
				value={undefined}
				strokeLinecap="round"
				track="stroke-surface-500/30 dark:stroke-surface-300/30"
			/>
		</div>
	{:else}
		<dl class="list-dl">
			{#if examDetails.ev_examorg_longtext || examDetails.ev_examorg_text}
				<div>
					<span class="badge-icon p-4 variant-soft-secondary"><i class="fa-solid fa-info"></i></span
					>
					<span class="flex-auto">
						<dt class="font-bold">
							{examDetails.ev_examorg_longtext
								? examDetails.ev_examorg_longtext
								: examDetails.ev_examorg_text}
						</dt>
						<dd class="text-sm opacity-50">Prüfungsart</dd>
					</span>
				</div>
			{/if}

			{#if examDetails.ev_reason}
				<div>
					<span class="badge-icon p-4 variant-soft-secondary"
						><i class="fa-solid fa-recycle"></i></span
					>
					<span class="flex-auto">
						<dt class="font-bold">{examDetails.ev_reason}</dt>
						<dd class="text-sm opacity-50">Versuch</dd>
					</span>
				</div>
			{/if}

			{#if examDetails.ev_examdate}
				<div>
					<span class="badge-icon p-4 variant-soft-secondary"
						><i class="fa-solid fa-calendar"></i></span
					>
					<span class="flex-auto">
						<dt class="font-bold">
							{examDetails.ev_examdate.split('-').reverse().join('.')} ({examDetails.ev_exambegtime.slice(
								0,
								5
							)}-{examDetails.ev_examendtime.slice(0, 5)})
						</dt>
						<dd class="text-sm opacity-50">Prüfungstermin</dd>
					</span>
				</div>
			{/if}

			{#if examDetails.ev_instructor}
				<div>
					<span class="badge-icon p-4 variant-soft-secondary"
						><i class="fa-solid fa-user-tie"></i></span
					>
					<span class="flex-auto">
						<dt class="font-bold">{examDetails.ev_instructor}</dt>
						<dd class="text-sm opacity-50">Prüfer</dd>
					</span>
				</div>
			{/if}
		</dl>
	{/if}
	<div class="arrow bg-surface-100-800-token" />
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
