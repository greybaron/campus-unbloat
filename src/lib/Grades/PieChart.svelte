<script lang="ts">
	import { browser } from '$app/environment';
	import type { ExamStats } from '$lib/types';
	import { Chart, registerables } from 'chart.js';
	import { onMount } from 'svelte';

	export let stats: ExamStats;

	Chart.register(...registerables);

	let pieChartElement: HTMLCanvasElement;

	const chartData = {
		datasets: [
			{
				data: [stats.successful, stats.unsuccessful, stats.unassessed],
				backgroundColor: ['#4685af', '#d4163c', '#c1c1c1'],
				borderWidth: 0
			}
		]
	};

	onMount(() => {
		if (browser) {
			new Chart(pieChartElement, {
				type: 'pie',
				data: chartData,
				options: {
					plugins: {
						legend: {
							display: false
						}
					}
				}
			});
		}
	});
</script>

<div class="size-28">
	<canvas bind:this={pieChartElement} />
</div>
