<script lang="ts">
	import type { CampusGradeStats } from '$lib/types';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import GradeStatColumn from './GradeStatColumn.svelte';

	export let gradeStats: CampusGradeStats | null;
	export let myGrade: number;

	let maxValue: number;
	$: if (gradeStats) {
		maxValue = Math.max(...Object.values(gradeStats));
	}
</script>

{#if !(gradeStats && maxValue && myGrade)}
	<div class="flex h-56 items-center justify-center">
		<ProgressRadial
			width="w-20"
			stroke={80}
			value={undefined}
			strokeLinecap="round"
			track="stroke-surface-500/30 dark:stroke-surface-300/30"
		/>
	</div>
{:else}
	<h4 class="h4 text-center">
		Insgesamt: {gradeStats.one +
			gradeStats.two +
			gradeStats.three +
			gradeStats.four +
			gradeStats.ronmodus}
	</h4>

	<div class="flex justify-evenly h-48 space-x-8 px-8 mt-2 pt-1 bg-secondary-500/10 rounded-xl">
		<GradeStatColumn label={1} value={gradeStats.one} {maxValue} isMyGrade={myGrade == 1} />
		<GradeStatColumn label={2} value={gradeStats.two} {maxValue} isMyGrade={myGrade == 2} />
		<GradeStatColumn label={3} value={gradeStats.three} {maxValue} isMyGrade={myGrade == 3} />
		<GradeStatColumn label={4} value={gradeStats.four} {maxValue} isMyGrade={myGrade == 4} />
		<GradeStatColumn label={5} value={gradeStats.ronmodus} {maxValue} isMyGrade={myGrade == 5} />
	</div>
{/if}
<div class="arrow bg-surface-100-800-token" />
