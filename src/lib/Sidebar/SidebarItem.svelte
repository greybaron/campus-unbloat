<script lang="ts">
	export let tw_color: string;
	export let opacity: string = '';
	export let label: string;
	export let href: string;
	export let icon: string | null = null;
	export let img_icon: string | null = null;
	export let alt: string | null = null;
	export let scale: string = '';
	export let active_url: string | null;
</script>

<li>
	<a
		class="justify-start overflow-clip border-token {active_url == href
			? 'bg-surface-50 dark:bg-surface-600 border-primary-400-500-token'
			: 'border-white border-opacity-0'}"
		{href}
	>
		<span class="flex-shrink-0 badge bg-{tw_color} size-10 {opacity} rounded-md">
			{#if img_icon}
				<img class={scale} src={img_icon} {alt} />
			{:else}
				<i class="{icon} scale-150 text-white"></i>
			{/if}
		</span>
		<!-- invisible label if screen not lg (large) -->
		<span class="transition-[opacity] opacity-0 lg:opacity-100">{label}</span>
	</a>
</li>
