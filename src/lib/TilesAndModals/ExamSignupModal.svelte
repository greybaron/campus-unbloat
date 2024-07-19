<script lang="ts">
	import DashboardModal from '$lib/DashboardModal.svelte';
	import type { ExamSignup } from '$lib/types';

	export let signupOptions: Array<ExamSignup>;
</script>

<DashboardModal title="Anmeldung">
	<svelte:fragment slot="body">
		<ul>
			{#each signupOptions as signup}
				<li>
					<strong>{signup.name}</strong>: {signup.verfahren} (Status: {signup.status})
				</li>
			{/each}
		</ul>
	</svelte:fragment>
	<svelte:fragment slot="optionalbuttons"></svelte:fragment>
</DashboardModal>
