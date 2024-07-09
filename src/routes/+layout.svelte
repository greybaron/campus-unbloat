<script lang="ts">
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import '../app.postcss';

	import { AppShell, AppBar, LightSwitch } from '@skeletonlabs/skeleton';

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	// import { initializeStores, Drawer } from '@skeletonlabs/skeleton';
	import Sidebar from '$lib/Sidebar/Sidebar.svelte';
	import TabbarMobile from '$lib/Sidebar/TabbarMobile.svelte';
	import { page } from '$app/stores';

	import { initializeStores, Modal } from '@skeletonlabs/skeleton';
	initializeStores();

	// initializeStores();
</script>

<Modal />

<!-- lmao 1 hour in and already doing this shit -->
<AppShell
	slotSidebarLeft={$page.url.pathname != '/'
		? 'transition-[width] duration-300 bg-surface-500/5 lg:w-64 sm:w-20 sm:block hidden'
		: ''}
>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<strong class="text-xl">CampusDual</strong>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<a
					class="btn btn-sm variant-ghost-surface"
					href="https://github.com/skeletonlabs/skeleton"
					target="_blank"
					rel="noreferrer"
				>
					GitHub
				</a>
				<LightSwitch />
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		{#if $page.url.pathname != '/'}
			<Sidebar />
		{/if}
	</svelte:fragment>

	<!-- Page Route Content -->
	<slot />
</AppShell>
{#if $page.url.pathname != '/'}
	<TabbarMobile />
{/if}
