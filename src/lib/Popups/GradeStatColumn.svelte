<script lang="ts">
	export let label: number;
	export let value: number;
	export let maxValue: number;
	export let isMyGrade: boolean;

	let percentage = Math.round((value / maxValue) * 75); // 75% is max due to bar label/value taking up vspace
</script>

<div class="flex flex-col h-full w-full items-center justify-end">
	{value}
	<div
		class="{isMyGrade ? 'bg-primary-500' : 'bg-secondary-500'} w-full"
		style="height: {percentage}%;"
	/>
	<small>{label}</small>
</div>
