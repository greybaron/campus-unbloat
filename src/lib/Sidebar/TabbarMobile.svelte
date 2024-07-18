<script lang="ts">
	import TabbarItem from './TabbarItem.svelte';
	import { page } from '$app/stores';
</script>

<div class="absolute bottom-2 w-full justify-center flex sm:hidden z-50">
	<div class="flex w-auto variant-glass-surface space-x-1 rounded-2xl">
		<TabbarItem
			href="/dashboard"
			tw_color="bg-red-400"
			label="Start"
			icon="fa-solid fa-house"
			active_url={$page.route.id}
		/>
		<TabbarItem
			href="/examsignup"
			tw_color="bg-orange-400"
			opacity="saturate-50"
			label="Prüfungsanmeldung"
			icon="fa-solid fa-pen"
			active_url={$page.route.id}
		/>
		<TabbarItem
			href="/vieren"
			tw_color="bg-emerald-600"
			label="Noten"
			scale="scale-125"
			icon="fa-solid fa-newspaper"
			active_url={$page.route.id}
		/>
	</div>
</div>
