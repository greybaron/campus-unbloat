<script lang="ts">
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import '../app.postcss';

	import { AppShell, AppBar, LightSwitch } from '@skeletonlabs/skeleton';

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	import { initializeStores, Modal, Toast } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';
	initializeStores();
</script>

<Toast buttonDismiss="btn-icon btn-icon-sm variant-filled transition-none" />
<Modal />

<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<strong class="text-xl">CampusUnbloat</strong>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<button
					on:click={async () => {
						goto('/logout');
					}}
					class="btn btn-sm variant-ghost-primary"
				>
					Abmelden
				</button>
				<LightSwitch />
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

	<!-- Page Route Content -->
	<slot />
</AppShell>
