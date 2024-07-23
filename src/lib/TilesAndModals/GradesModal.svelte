<script lang="ts">
	import DashboardModal from '$lib/DashboardModal.svelte';
	import { type CampusDualGrade } from '$lib/types';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { type SvelteComponent } from 'svelte';

	export let grades: Array<CampusDualGrade>;
	export let parent: SvelteComponent;
</script>

<DashboardModal bind:parent title="Noten">
	{#if grades}
		<Accordion>
			{#each grades as grade}
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
	{/if}
</DashboardModal>
