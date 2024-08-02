<script lang="ts">
	type MensaMealType = {
		meal_type: string;
		sub_meals: MensaSubMeals;
	};

	type MensaSubMeals = Array<{
		name: string;
		additional_ingredients: Array<string>;
		price: string;
		allergens?: string;
		variations?: Array<MealVariations>;
	}>;

	type MealVariations = {
		name: string;
		allergens_and_add: string;
	};

	export let meal: MensaMealType;
</script>

<div class="space-y-1">
	{#each meal.sub_meals as submeal}
		<div
			class="card p-2 pl-4 pr-4 border-dashed border-token border-surface-700-200-token space-y-2"
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
					<div class="flex flex-grow justify-center items-center">
						<div class="text-left">
							<ul class="list-disc list-inside">
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

					<div class="text-center flex-grow">
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
			<div class="card p-2 border-dashed border-token border-surface-700-200-token space-y-2">
				<strong>Variationen</strong>
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
