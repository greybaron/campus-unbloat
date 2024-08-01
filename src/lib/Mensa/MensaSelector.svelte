<script lang="ts">
	import { tick } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { Mensa } from '../types';

	export let mensaSelectElementValue: number | undefined = undefined;
	export let selectedMensa: Writable<number>;
	export let mensaList: Array<Mensa>;

	function mensalist_populated(_element: HTMLSelectElement) {
		// allegedly, svelte actions trigger once an element is created,
		// but mensaSelectElementValueDropdown is still undefined at this point sooo...
		tick().then(() => {
			mensaSelectElementValue = $selectedMensa;
		});
	}

	function changeMensa(mensaId: number | undefined) {
		if (mensaId) {
			selectedMensa.set(mensaId);
		}
	}
</script>

<select
	class="select mb-2 transition-none"
	bind:value={mensaSelectElementValue}
	on:change={() => {
		changeMensa(mensaSelectElementValue);
	}}
	use:mensalist_populated
>
	{#each mensaList as mensa}
		<option value={mensa.id}>{mensa.name}</option>
	{/each}
</select>
