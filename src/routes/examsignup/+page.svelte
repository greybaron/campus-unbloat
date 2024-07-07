<script context="module" lang="ts">
	import PageContainer from '$lib/PageContainer.svelte';
	import { onMount } from 'svelte';
</script>

<script lang="ts">
	onMount(async () => {
		console.log('Fetching signup ops...');
		const res = await fetch('/api/examsignup');

		if (!res.ok) {
			return { props: { error: res.status } };
		}

		signup_ops = await res.json();
	});

	export let signup_ops: Array<{ name: string; verfahren: string; status: string }> = [];
	export let error: number | null = null;

	if (error) {
		console.error('Failed to load signup ops (they opps):', error);
	}
</script>

<PageContainer>
	{#if error}
		<p>Failed to load grades. Error: {error}</p>
	{:else}
		<ul>
			{#each signup_ops as signup}
				<li>
					<strong>{signup.name}</strong>: {signup.verfahren} (Status: {signup.status})
				</li>
			{/each}
		</ul>
	{/if}
</PageContainer>
