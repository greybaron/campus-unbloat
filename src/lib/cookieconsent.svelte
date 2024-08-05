<script>
	import { onMount } from 'svelte';
	import * as CookieConsent from 'vanilla-cookieconsent';
	import config from '$lib/cookieconsent-config';

	onMount(() => {
		CookieConsent.run(config);
	});
</script>
