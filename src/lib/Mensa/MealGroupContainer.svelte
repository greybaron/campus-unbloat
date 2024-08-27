<script lang="ts">
	import type { MensaMeal } from '$lib/types';

	export let meal: MensaMeal;
</script>

<div class="space-y-1">
	{#each meal.sub_meals as submeal}
		<div
			class="rounded-xl bg-surface-50-900-token px-4 py-2 border-dashed border-token border-surface-700-200-token space-y-2"
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
					<div class="flex flex-grow items-center">
						<div class="text-left ml-4">
							<ul class="list-disc">
								{#each submeal.additional_ingredients as ingredient}
									<li>{ingredient}</li>
								{/each}
							</ul>
						</div>
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
			<div class="flex flex-row space-x-2">
				<div>
					<span class="badge-icon p-3 variant-outline">
						<i class="fa-solid fa-coins"></i>
					</span>
				</div>
				<div class="flex-grow">
					<i>{submeal.price}</i>
				</div>
			</div>
		</div>

		{#if submeal.variations}
			<div
				class="rounded-xl bg-surface-50-900-token px-4 py-2 border-dashed border-token border-surface-700-200-token space-y-2"
			>
				<div class="flex space-x-2">
					<div class="badge-icon p-3 variant-outline">
						<i class="fa-solid fa-flask-vial"></i>
					</div>
					<strong>Variationen</strong>
					<!-- <i class="fa-solid fa-house"></i> -->
				</div>
				{#each submeal.variations as variation}
					<hr />
					<strong>{variation.name}</strong>
					{#if variation.allergens_and_add}
						<div>
							<strong>Allergene: </strong><span>{variation.allergens_and_add}</span>
						</div>
					{/if}
				{/each}
			</div>
		{/if}
	{/each}
</div>
