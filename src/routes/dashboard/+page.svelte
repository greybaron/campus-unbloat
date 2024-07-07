<script lang="ts">
	import PageContainer from '$lib/PageContainer.svelte';
	import { onMount } from 'svelte';
	export let data;

	let deser_data: {
		first_name: string;
		last_name: string;
		seminar_group: string;
		seminar_name: string;
		user: string;
	};

	onMount(() => {
		deser_data = JSON.parse(data.user_basic!);
	});
</script>

<PageContainer>
	{#if deser_data}
		<h1>Grüße {deser_data.first_name} {deser_data.last_name} ({deser_data.user})</h1>
		<p>Seminargruppe: {deser_data.seminar_group} - {deser_data.seminar_name}</p>
	{/if}
</PageContainer>
