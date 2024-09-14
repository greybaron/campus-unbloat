<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { Chart, PieController, ArcElement, Tooltip } from 'chart.js';

	import type { ExamStats } from '$lib/types';

	export let stats: ExamStats;

	const chartData = {
		datasets: [
			{
				data: [stats.successful, stats.unsuccessful, stats.unassessed],
				backgroundColor: ['#4685af', '#d4163c', '#c1c1c1'],
				borderWidth: 0
			}
		]
	};

	Chart.register(PieController, ArcElement, Tooltip);
	let pieChartElement: HTMLCanvasElement;

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
