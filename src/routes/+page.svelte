<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	export let form: ActionData;
</script>

<div class="flex w-hull h-full items-center justify-center">
	<div class="w-full max-w-xs">
		<form
			use:enhance
			action="?/login"
			method="POST"
			class="bg-surface-100-800-token dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4"
		>
			<div class="mb-4">
				<label class="block text-token text-sm font-bold mb-2" for="username">
					CampusDual-Benutzername
				</label>
				<input
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					name="username"
					type="text"
					placeholder="500xxxx"
				/>
			</div>
			<div class="mb-6">
				<label class="block text-token text-sm font-bold mb-2" for="password"
					>CampusDual-Passwort</label
				>
				<input
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-600 leading-tight focus:outline-none focus:shadow-outline"
					name="password"
					type="password"
					placeholder="***************"
				/>
				{#if form?.message}
					<small class="text-red-500" id="email-error">{form.message}</small>
				{/if}
			</div>
			<div class="flex justify-center">
				<button
					class="w-32 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
				>
					Anmelden
				</button>
			</div>
		</form>
	</div>
</div>
