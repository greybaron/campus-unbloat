<script lang="ts">
	import SidebarItem from '$lib/Sidebar/SidebarItem.svelte';

	// import prosthetics_icon from '$lib/images/navigation_icons/prosthetic_icon.svg';
	// import skilltree_icon from '$lib/images/navigation_icons/katana_icon.svg';
	import { page } from '$app/stores';

	let items: HTMLUListElement;
</script>

<nav class="list-nav p-1" id="nav">
	<ul bind:this={items}>
		<SidebarItem
			href="/dashboard"
			tw_color="red-400"
			label="Start"
			icon="fa-solid fa-house"
			active_url={$page.route.id}
		/>
		<SidebarItem
			href="/examsignup"
			tw_color="orange-400"
			opacity="saturate-50"
			label="Prüfungsanmeldung"
			icon="fa-solid fa-pen"
			active_url={$page.route.id}
		/>
		<SidebarItem
			href="/vieren"
			tw_color="emerald-600"
			label="Noten"
			alt="Bild eines Arms"
			scale="scale-125"
			icon="fa-solid fa-newspaper"
			active_url={$page.route.id}
		/>
		<!-- <SidebarItem
			href="/skilltree"
			tw_color="red-500"
			label="Fähigkeiten"
			alt="Bild eines Schwertes"
			scale="scale-[1.2]"
			active_url={$page.route.id}
		/> -->
	</ul>
</nav>
