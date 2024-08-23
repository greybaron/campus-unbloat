<script lang="ts">
	export let label: string;
	export let value: number;
	export let total: number;
	export let color: string;

	function getPercentLabel() {
		return `${Math.round((value / total) * 100)}%`;
	}
</script>

<li class="conic-item bg-primary-hover-token">
	<span
		class="conic-swatch block aspect-square bg-black w-5 rounded-full mr-2"
		style="background: {color};"
	></span> <span class="conic-label flex-auto">{label}</span>
	<strong class="conic-value">{getPercentLabel()}</strong>
</li>
