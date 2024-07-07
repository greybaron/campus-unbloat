<script context="module" lang="ts">
	import PageContainer from '$lib/PageContainer.svelte';
	import { onMount } from 'svelte';
</script>

<script lang="ts">
	onMount(async () => {
		console.log('Fetching grades...');
		const res = await fetch('/api/grades');

		if (!res.ok) {
			return { props: { error: res.status } };
		}

		grades = await res.json();
		// grades =
		// return { props: { grades } };
	});

	export let grades: Array<{ name: string; grade: string; subgrades: number }> = [];
	export let error: number | null = null;

	if (error) {
		console.error('Failed to load grades:', error);
	}
</script>

<PageContainer>
	{#if error}
		<p>Failed to load grades. Error: {error}</p>
	{:else}
		<ul>
			{#each grades as grade}
				<li>
					<strong>{grade.name}</strong>: {grade.grade} (Subgrades: {grade.subgrades})
				</li>
			{/each}
		</ul>
	{/if}
</PageContainer>
