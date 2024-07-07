<script lang="ts">
	import TabbarItem from './TabbarItem.svelte';
	import { page } from '$app/stores';
	// import prosthetics_icon from '$lib/images/navigation_icons/prosthetic_icon.svg';
	// import skilltree_icon from '$lib/images/navigation_icons/katana_icon.svg';
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
		<!-- <TabbarItem
			href="/skilltree"
			tw_color="red-500"
			label="Fähigkeiten"
			alt="Bild eines Schwertes"
			scale="scale-[1.2]"
			active_url={$page.route.id}
		/> -->
		<!-- <TabbarItem
			href="/"
			active_url={$page.route.id}
			tw_color="bg-red-400"
			label="Start"
			icon="fa-solid fa-house"
			on:click
		/>
		<TabbarItem
			href="/map"
			active_url={$page.route.id}
			tw_color="bg-orange-400"
			opacity="saturate-50"
			label="Karte"
			icon="fa-solid fa-earth-americas"
		/>
		<TabbarItem
			href="/prosthetics"
			active_url={$page.route.id}
			tw_color="bg-emerald-600"
			label="Prothesen"
			img_icon={prosthetics_icon}
			scale="scale-125"
		/>
		<TabbarItem
			href="/skilltree"
			active_url={$page.route.id}
			tw_color="bg-red-500"
			label="Fähigkeiten"
			img_icon={skilltree_icon}
			scale="scale-[1.2]"
		/> -->
	</div>
</div>
