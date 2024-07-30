<script lang="ts">
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import '../app.postcss';

	import { AppShell, AppBar, LightSwitch, getDrawerStore } from '@skeletonlabs/skeleton';

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	import { initializeStores, Modal, Toast, Drawer } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	initializeStores();

	function formatDate(abapdate: string) {
		const year = abapdate.slice(0, 4);
		const month = abapdate.slice(4, 6);
		const day = abapdate.slice(6, 8);

		return `${day}.${month}.${year}`;
	}

	const drawerStore = getDrawerStore();
</script>

<Toast buttonDismiss="btn-icon btn-icon-sm variant-filled transition-none" />
<Drawer
	on:drawer={() => drawerStore.close()}
	position="right"
	width="min-w-0 ml-12"
	bgDrawer="variant-glass-primary bg-red-200/30"
	bgBackdrop=""
	regionDrawer="p-8"
>
	<div class="flex flex-col justify-center h-full space-y-4">
		{#if $drawerStore.meta.reminders}
			{#if $drawerStore.meta.reminders.latest.length > 0}
				<div>
					<h3 class="h3 font-bold">Letze Prüfungsergebnisse</h3>

					<ul class="list-disc list-inside text-lg">
						{#each $drawerStore.meta.reminders.latest as item}
							<li>
								<strong>{formatDate(item.agrdate)}</strong>: {item.awobject} ({item.awobject_short})
								-
								<strong>{item.gradesymbol}</strong>
							</li>
						{/each}
					</ul>
				</div>
			{/if}

			{#if $drawerStore.meta.reminders.upcoming.length > 0}
				<div>
					<h3 class="h3 font-bold">Anstehende Prüfungen</h3>
					<ul class="list-disc list-inside text-lg">
						{#each $drawerStore.meta.reminders.upcoming as item}
							<li>
								<strong>{formatDate(item.evdat)}</strong>: {item.sm_stext}
							</li>
						{/each}
					</ul>
				</div>
			{/if}

			{#if $drawerStore.meta.reminders.exams > 0}
				<h3 class="h3 font-bold">Sie können sich für Prüfungsverfahren anmelden</h3>
			{/if}

			{#if $drawerStore.meta.reminders.electives > 0 && $drawerStore.meta.reminders.semester <= 6}
				<strong>
					<p>
						Anmeldung für Wahlpflichtmodule im {$drawerStore.meta.reminders.semester}. Fachsemester
					</p>
				</strong>
			{/if}
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
