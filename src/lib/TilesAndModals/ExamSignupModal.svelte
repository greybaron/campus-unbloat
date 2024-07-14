<script lang="ts">
	import DashboardModal from '$lib/DashboardModal.svelte';

	export let signup_ops: Array<{ name: string; verfahren: string; status: string }>;
</script>

<DashboardModal title="Anmeldung">
	<svelte:fragment slot="body">
		<ul>
			{#each signup_ops as signup}
				<li>
					<strong>{signup.name}</strong>: {signup.verfahren} (Status: {signup.status})
				</li>
			{/each}
		</ul>
	</svelte:fragment>
	<svelte:fragment slot="optionalbuttons"></svelte:fragment>
</DashboardModal>
