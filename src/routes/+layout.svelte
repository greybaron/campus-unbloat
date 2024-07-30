<script lang="ts">
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import '../app.postcss';

	import {
		AppShell,
		AppBar,
		LightSwitch,
		getToastStore,
		ProgressRadial
	} from '@skeletonlabs/skeleton';

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	import { initializeStores, Modal, Toast, Drawer } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import {
		getToastSettings,
		ToastPayloadClass,
		type CdReminders,
		type ToastPayload
	} from '$lib/types';
	import { onMount } from 'svelte';

	initializeStores();

	const toastStore = getToastStore();
	let reminders: CdReminders;
	let presentNotificationCategories: number = 0;

	onMount(async () => {
		console.log('Fetching reminders...');
		const res = await fetch('/api/reminders');

		if (!res.ok) {
			let error = await res.text();
			let payload: ToastPayload = {
				text: error,
				class: ToastPayloadClass.error
			};

			const toastSettings = getToastSettings(payload);
			toastStore.trigger(toastSettings);
		} else {
			reminders = await res.json();
			presentNotificationCategories = getPresentNotificationCategories(reminders);
			console.log(presentNotificationCategories);
		}
	});

	function getPresentNotificationCategories(reminders: CdReminders): number {
		let presentNotificationCategories = 0;

		if (reminders.latest.length > 0) {
			presentNotificationCategories++;
		}

		if (reminders.upcoming.length > 0) {
			presentNotificationCategories++;
		}

		if (reminders.exams > 0) {
			presentNotificationCategories++;
		}

		if (reminders.electives > 0 && reminders.semester <= 6) {
			presentNotificationCategories++;
		}

		return presentNotificationCategories;
	}

	// let res =
	// 	'{"electives":0,"exams":1,"latest":[{"acad_session":"Sommerperiode","acad_year":"Akad. Jahr 2023/2024","agrdate":"20240717","agrtype":"Teilleistungsbeurteilung","awobject":"P Integrierte Informationssysteme (C)","awobject_short":"5CS-ERPS-00","awotype":"Studienmodul","awstatus":"Erfolgreich abgeschlossen","bookdate":"20240718","bookreason":"","cpgraded":"  0.00000","cpunit":"ECTS-Credits","gradesymbol":"1,3"}],"semester":7,"upcoming":[{"beguz":"090000","comment":"Prüfung (SEP)","enduz":"110000","evdat":"20240903","instructor":"diverse","location":"","objid":"00000000","room":"104 Seminarraum","sinstructor":"","sm_short":"5CS-MEDIT-00","sm_stext":"P Medizinisches Informationsmanagem. (K)","sroom":"5SR 104"},{"beguz":"080000","comment":"Prüfung (SEP)","enduz":"000000","evdat":"20240910","instructor":"Prof. Dr. Siegmund","location":"","objid":"00000000","room":"104 Seminarraum","sinstructor":"","sm_short":"5CS-V3DA-02","sm_stext":"P2 Videotech., 3D-Modell. u. Animat. (P)","sroom":"5SR 104"},{"beguz":"080000","comment":"Prüfung (SEP)","enduz":"000000","evdat":"20240912","instructor":"diverse","location":"","objid":"00000000","room":"104 Seminarraum","sinstructor":"","sm_short":"5CS-STDS-02","sm_stext":"P2 Servers. Techn. u. vert. Systeme (P)","sroom":"5SR 104"},{"beguz":"080000","comment":"Prüfung (SEP)","enduz":"000000","evdat":"20240912","instructor":"diverse","location":"","objid":"00000000","room":"104 Seminarraum","sinstructor":"","sm_short":"5CS-STDS-01","sm_stext":"P1 Servers. Techn. u. vert. Systeme (SE)","sroom":"5SR 104"}]}';

	function formatDate(abapdate: string) {
		const year = abapdate.slice(0, 4);
		const month = abapdate.slice(4, 6);
		const day = abapdate.slice(6, 8);

		return `${day}.${month}.${year}`;
	}
</script>

<Toast buttonDismiss="btn-icon btn-icon-sm variant-filled transition-none" />
<Drawer
	position="right"
	width="min-w-0 ml-12"
	bgDrawer="variant-glass-primary bg-white/30"
	bgBackdrop=""
	regionDrawer="p-8"
>
	<div class="flex flex-col justify-center h-full space-y-4">
		{#if !reminders}
			<ProgressRadial
				width="w-20 m-9"
				stroke={80}
				value={undefined}
				strokeLinecap="round"
				track="stroke-surface-500/30 dark:stroke-surface-300/30"
			/>
		{:else}
			{#if reminders.latest.length > 0}
				<div>
					<h3 class="h3 font-bold">Letze Prüfungsergebnisse</h3>

					<ul class="list-disc list-inside text-lg">
						{#each reminders.latest as item}
							<li>
								{formatDate(item.agrdate)}: {item.awobject} ({item.awobject_short}) -
								<strong>{item.gradesymbol}</strong>
							</li>
						{/each}
					</ul>
				</div>
			{/if}

			{#if reminders.upcoming.length > 0}
				<div>
					<h3 class="h3 font-bold">Anstehende Prüfungen</h3>
					<ul class="list-disc list-inside text-lg">
						{#each reminders.upcoming as item}
							<li>
								{formatDate(item.evdat)}: {item.sm_stext}
							</li>
						{/each}
					</ul>
				</div>
			{/if}

			{#if reminders.exams > 0}
				<h3 class="h3 font-bold">Sie können sich für Prüfungsverfahren anmelden</h3>
			{/if}

			{#if reminders.electives > 0 && reminders.semester <= 6}
				<strong>
					<p>Anmeldung für Wahlpflichtmodule im {reminders.semester}. Fachsemester</p>
				</strong>
			{/if}
			<!-- </ul> -->
		{/if}
	</div>
</Drawer>
<Modal />

<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<strong on:click={() => {}} class="text-xl">CampusUnbloat</strong>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				{#if $page.url.pathname != '/'}
					<button
						on:click={async () => {
							await fetch('/logout', {
								method: 'POST'
							});
							goto('/');
						}}
						class="btn btn-sm variant-ghost-primary"
					>
						Abmelden
					</button>
				{:else}
					<div class="h-8" />
				{/if}
				<LightSwitch />
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

	<!-- Page Route Content -->
	<slot />
</AppShell>
