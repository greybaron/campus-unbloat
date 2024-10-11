<script lang="ts">
	import type { MealGroup } from '$lib/types';
	import { createEventDispatcher } from 'svelte';

	export let mealGroup: MealGroup;
	export let gradientColour: string;

	const dispatch = createEventDispatcher();
</script>

<div
	on:click={() => {
		dispatch('click');
	}}
	role="presentation"
	class="space-y-1"
>
	{#each mealGroup.sub_meals as submeal}
		<div
			class="rounded-xl bg-gradient-165 to-40% {gradientColour} bg-surface-50-900-token px-4 py-2 border-token border-surface-400-500-token space-y-2 text-center"
		>
			<strong>{submeal.name}</strong>
			<hr />

			{#if submeal.additional_ingredients.length > 0}
				<div class="flex flex-row space-x-2">
					<div>
						<span class="badge-icon p-3 variant-outline">
							<i class="fa-solid fa-plus"></i>
						</span>
					</div>
					<div>
						{#each submeal.additional_ingredients as ingredient}
							<p class="text-left">{ingredient}</p>
						{/each}
					</div>
				</div>
				<hr />
			{/if}

			{#if submeal.allergens}
				<div class="flex flex-row space-x-2">
					<div>
						<span class="badge-icon p-3 variant-outline">
							<i class="fa-solid fa-info"></i>
						</span>
					</div>

					<div class="text-left flex-grow">
						<strong>Allergene: </strong><span>{submeal.allergens}</span>
					</div>
				</div>
				<hr />
			{/if}
			<div>
				<i class="text-center w-full">{submeal.price}</i>
			</div>
		</div>

		{#if submeal.variations}
			<div
				class="rounded-xl bg-surface-50-900-token px-4 py-2 border-token border-surface-400-500-token space-y-2"
			>
				<div class="flex space-x-2">
					<div class="badge-icon p-3 variant-outline">
						<i class="fa-solid fa-flask-vial"></i>
					</div>
					<strong>Variationen</strong>
				</div>
				{#each submeal.variations as variation}
					<hr class="pb-1" />
					<strong>{variation.name}</strong>
					{#if variation.allergens_and_add}
						<div class="flex flex-row space-x-2">
							<div>
								<span class="badge-icon p-3 variant-outline">
									<i class="fa-solid fa-info"></i>
								</span>
							</div>

							<div class="text-left flex-grow">
								<strong>Allergene: </strong><span>{variation.allergens_and_add}</span>
							</div>
						</div>
					{/if}
				{/each}
			</div>
		{/if}
	{/each}
</div>
