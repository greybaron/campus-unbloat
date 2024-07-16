<script lang="ts">
	type mensaMealType = {
		meal_type: string;
		sub_meals: mensaSubMeals;
	};

	type mensaSubMeals = Array<{
		name: string;
		additional_ingredients: Array<string>;
		price: string;
	}>;

	export let meal: mensaMealType;
</script>

<div class="v">
	{#each meal.sub_meals as submeal}
		<p>{submeal.name}</p>
		<p>{submeal.price}</p>
	{/each}
</div>
