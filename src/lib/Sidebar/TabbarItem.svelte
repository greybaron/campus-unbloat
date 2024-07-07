<script lang="ts">
	export let tw_color: string;
	export let opacity: string = '';
	export let label: string;
	export let icon: string | null = null;
	export let img_icon: string | null = null;
	export let scale: string = '';
	export let href: string;
	export let active_url: string | null;
</script>

<a {href}>
	<div
		class="flex items-center justify-center rounded-2xl size-14 border-token {active_url == href
			? 'bg-surface-50 dark:bg-surface-600 border-primary-400-500-token'
			: 'border-white border-opacity-0 hover:bg-primary-500/20'}"
	>
		<span class="badge {tw_color} size-10 {opacity} rounded-lg">
			{#if img_icon}
				<img class={scale} src={img_icon} alt={label} />
			{:else}
				<i class="{icon} scale-150 text-white"></i>
			{/if}
		</span>
	</div>
</a>
