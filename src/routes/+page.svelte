<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import type { ActionData } from './$types';
	export let form: ActionData;

	let login_in_progress = false;
</script>

<div class="flex h-full items-center justify-center">
	<div class="w-full max-w-sm">
		<form
			use:enhance={() => {
				// clear the previous response if any (to remove bad credentials msg)
				form = null;
				login_in_progress = true;

				return async ({ update }) => {
					await update();
					login_in_progress = false;
				};
			}}
			action="?/login"
			method="POST"
			class="bg-surface-100-800-token dark:bg-gray-800 shadow-md rounded-token p-6 pb-4"
		>
			<div class="mb-4">
				<label class="block text-token text-sm font-bold mb-2" for="username">
					CampusDual-Benutzername
				</label>
				<input
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					name="username"
					type="text"
					required
					placeholder="500xxxx"
				/>
			</div>
			<div>
				<label class="block text-token text-sm font-bold mb-2" for="password"
					>CampusDual-Passwort</label
				>
				<input
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-600 leading-tight focus:outline-none focus:shadow-outline"
					name="password"
					type="password"
					required
					placeholder="das normale, nicht den Hash"
				/>
				<div class="h-4">
					{#if form?.message}
						<small class="text-red-500">{form.message}</small>
					{/if}
				</div>
			</div>

			<div class="bg-surface-200-700-token p-2 rounded-md space-y-2 outline-dashed outline-1">
				<div class="flex items-center space-x-2">
					<input
						type="checkbox"
						class="checkbox outline variant-outline-surface outline-2"
						name="dataConsent"
						required
					/>
					<p class="text-sm font-bold">
						Ich stimme zu, dass
						<span
							class="bg-gradient-to-br from-blue-700 to-pink-600 bg-clip-text text-transparent box-decoration-clone"
							>CampusUnbloat</span
						>
						sich in meinem Namen bei CampusDual einloggt.
						<br />
						Daten werden nur lokal gespeichert.
					</p>
				</div>

				<div class="flex justify-center space-x-2">
					<button
						on:click={() => {
							goto('/impressum');
						}}
						type="button"
						class="transition-none variant-filled btn text-sm h-7">Impressum</button
					>
					<button
						on:click={() => {
							goto('/datenschutz');
						}}
						type="button"
						class="transition-none variant-filled btn text-sm h-7">Datenschutzerklärung</button
					>
				</div>
			</div>

			<div class="flex justify-center mt-4">
				<button
					class="{login_in_progress ? 'variant-ghost-primary' : 'variant-filled-primary'} btn w-32"
				>
					Anmelden
				</button>
			</div>
		</form>
	</div>
</div>
