<script lang="ts">
	import DashboardModal from '$lib/DashboardModal.svelte';
	import { type CampusDualGrade } from '$lib/types';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { type SvelteComponent } from 'svelte';

	export let grades: Array<CampusDualGrade>;
	let filteredGrades: Array<CampusDualGrade> = grades;
	export let parent: SvelteComponent;

	let filter: string;
	$: filterGrades(filter);

	function filterGrades(filter: string) {
		if (filter == '') {
			filteredGrades = grades;
		} else if (filter) {
			filteredGrades = grades.filter((grade) =>
				grade.name.toLowerCase().includes(filter.toLowerCase())
			);
		}
	}
</script>

<DashboardModal bind:parent title="Noten">
	<svelte:fragment slot="header">
		<input bind:value={filter} class="input" type="text" placeholder="Suchen..." />
	</svelte:fragment>

	{#if filteredGrades && filteredGrades.length > 0}
		<Accordion>
			{#each filteredGrades as grade}
				<AccordionItem>
					<svelte:fragment slot="lead">
						<span
							class="badge-icon p-4 {grade.total_passed === undefined
								? 'variant-filled'
								: grade.total_passed
									? 'variant-filled-success'
									: ' variant-filled-error'}">{grade.grade}</span
						>
					</svelte:fragment>
					<svelte:fragment slot="summary">{grade.name}</svelte:fragment>
					<svelte:fragment slot="content">
						<div class="w-full text-token card p-2 space-y-4">
							<dl class="list-dl">
								<div>
									<span class="badge-icon p-4 variant-soft-secondary"
										><i class="fa-solid fa-calendar"></i></span
									>
									<span class="flex-auto">
										<dt class="font-bold">{grade.akad_period}</dt>
										<dd class="text-sm opacity-50">Akademische Periode</dd>
									</span>
								</div>

								<div>
									<span class="badge-icon p-4 variant-soft-secondary"
										><i class="fa-solid fa-coins"></i></span
									>
									<span class="flex-auto">
										<dt class="font-bold">{grade.credit_points}</dt>
										<dd class="text-sm opacity-50">ECTS-Credits</dd>
									</span>
								</div>
							</dl>
						</div>

						<div class="w-full text-token card p-2 space-y-4">
							<dl class="list-dl">
								{#each grade.subgrades as subgrade}
									<div>
										<span
											class="badge-icon p-4 {subgrade.passed === undefined
												? 'variant-filled'
												: subgrade.passed
													? 'variant-filled-success'
													: ' variant-filled-error'}">{subgrade.grade}</span
										>
										<span class="flex-auto">
											<dt class="font-bold">{subgrade.name}</dt>
											<dd class="text-sm opacity-50">
												{subgrade.wiederholung ? `${subgrade.wiederholung} ⋅ ` : ''}Bekanntgabe: {subgrade.bekanntgabe}
												⋅ {subgrade.akad_period}
											</dd>
										</span>
									</div>
								{/each}
							</dl>
						</div>
					</svelte:fragment>
				</AccordionItem>
			{/each}
		</Accordion>
	{:else}
		<div class="flex justify-center">
			<p class="text-token text-lg">Keine Noten gefunden.</p>
		</div>
	{/if}
</DashboardModal>
