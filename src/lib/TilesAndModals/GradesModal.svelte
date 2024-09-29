<script lang="ts">
	import {
		Accordion,
		AccordionItem,
		getToastStore,
		popup,
		type PopupSettings
	} from '@skeletonlabs/skeleton';
	import { type SvelteComponent } from 'svelte';

	import {
		getToastSettings,
		ToastPayloadClass,
		type CampusDualGrade,
		type CampusGradeMetadata,
		type CampusGradeStats
	} from '$lib/types';
	import DashboardModal from '$lib/DashboardModal.svelte';
	import GradeStatsPopup from '$lib/Popups/GradeStatsPopup.svelte';

	export let parent: SvelteComponent;
	export let grades: Array<CampusDualGrade>;

	const averageGrade =
		grades.reduce((sum, item) => {
			return sum + parseFloat(item.grade.replace(',', '.')); // Convert string to number and add to sum
		}, 0) / grades.length;
	const popupAvgInfo: PopupSettings = {
		event: 'hover',
		target: 'popupAvgInfo',
		placement: 'left'
	};

	const toastStore = getToastStore();

	let filteredGrades: Array<CampusDualGrade> = grades;

	let filter: string;
	let filterElement: HTMLInputElement;
	$: filterGrades(filter);

	function filterGrades(filter: string) {
		if (filter == '') {
			filteredGrades = grades;
		} else if (filter) {
			const words = filter.split(' ').map((word) => word.trim().toLowerCase());
			filteredGrades = grades.filter((grade) =>
				words.every((word) => grade.name.toLowerCase().includes(word))
			);
		}
	}

	let gradeStats: CampusGradeStats | null = null;
	// dirty global used for stats popup
	let myGrade: number;
	let popupOpen = false;

	const popupGradeStats: PopupSettings = {
		state(event) {
			// dirty workaround for race condition
			setTimeout(() => {
				popupOpen = event.state;
			}, 100);
		},
		event: 'click',
		target: 'popupGradeStats',
		placement: 'top'
	};

	async function getGradeStats(internal_metadata?: CampusGradeMetadata) {
		if (popupOpen) return;
		gradeStats = null;
		const response = await fetch('/api/gradestats', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(internal_metadata)
		});

		if (!response.ok) {
			const toastSettings = getToastSettings({
				text: await response.text(),
				class: ToastPayloadClass.error
			});
			toastStore.trigger(toastSettings);
			return;
		} else {
			gradeStats = await response.json();
		}
	}

	function getRoundedGrade(grade: string): number {
		const float = parseFloat(grade.replace(',', '.'));
		if (isNaN(float)) return 0;

		return Math.round(float);
	}
</script>

<svelte:window
	on:keydown={() => {
		filterElement.focus();
	}}
/>

<div class="card p-4 shadow-xl" data-popup="popupAvgInfo">
	<div><p>Ungewichteter Durchschnitt</p></div>
	<div class="arrow bg-surface-100-800-token" />
</div>

<div class="card p-2 w-80 shadow-2xl z-50" data-popup="popupGradeStats">
	<GradeStatsPopup bind:gradeStats bind:myGrade />
</div>
<DashboardModal bind:parent title="Noten">
	<svelte:fragment slot="header">
		<div class="flex space-x-2">
			<input
				bind:this={filterElement}
				bind:value={filter}
				class="input"
				type="text"
				placeholder="Suchen..."
			/>
			<div use:popup={popupAvgInfo} class="badge variant-filled pl-3 bg-red-400 z-50">
				<i class="fa-solid fa-graduation-cap scale-125"></i>
				<!-- {averageGrade.toPrecision(3)} -->
				<p class="pointer-events-none">{averageGrade.toPrecision(3)}</p>
			</div>
		</div>
	</svelte:fragment>

	{#if filteredGrades && filteredGrades.length > 0}
		<Accordion autocollapse>
			{#each filteredGrades as grade, idx}
				<AccordionItem open={idx == 0}>
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
									<span class="badge-icon size-8 variant-soft-secondary"
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
											class="badge-icon size-8 flex-shrink-0 {subgrade.passed === undefined
												? 'variant-filled'
												: subgrade.passed
													? 'variant-filled-success'
													: ' variant-filled-error'}">{subgrade.grade}</span
										>
										<span class="flex-auto">
											<dt class="text-sm">{subgrade.name}</dt>
											<dd class="text-sm opacity-50">
												{subgrade.wiederholung ? `${subgrade.wiederholung} ⋅ ` : ''}Bekanntgabe: {subgrade.bekanntgabe}
												⋅ {subgrade.akad_period}
											</dd>
										</span>
										{#if Boolean(subgrade.internal_metadata)}
											<button
												on:click={() => {
													myGrade = getRoundedGrade(subgrade.grade);
													getGradeStats(subgrade.internal_metadata);
												}}
												use:popup={popupGradeStats}
												class="btn rounded-md size-8 variant-filled btn-icon flex-shrink-0"
											>
												<i class="fa-solid fa-chart-column"></i>
											</button>
										{/if}
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
