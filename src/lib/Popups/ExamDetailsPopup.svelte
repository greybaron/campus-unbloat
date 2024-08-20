<script lang="ts">
	import type { CampusExamDetails } from '$lib/types';
	import { ProgressRadial } from '@skeletonlabs/skeleton';

	export let examDetails: CampusExamDetails | null;
</script>

{#if !examDetails}
	<div class="flex h-56 items-center justify-center">
		<ProgressRadial
			width="w-20"
			stroke={80}
			value={undefined}
			strokeLinecap="round"
			track="stroke-surface-500/30 dark:stroke-surface-300/30"
		/>
	</div>
{:else}
	<dl class="list-dl">
		{#if examDetails.ev_examorg_longtext || examDetails.ev_examorg_text}
			<div>
				<span class="badge-icon p-4 variant-soft-secondary"><i class="fa-solid fa-info"></i></span>
				<span class="flex-auto">
					<dt class="font-bold">
						{examDetails.ev_examorg_longtext
							? examDetails.ev_examorg_longtext
							: examDetails.ev_examorg_text}
					</dt>
					<dd class="text-sm opacity-50">Prüfungsart</dd>
				</span>
			</div>
		{/if}

		{#if examDetails.ev_reason}
			<div>
				<span class="badge-icon p-4 variant-soft-secondary"
					><i class="fa-solid fa-recycle"></i></span
				>
				<span class="flex-auto">
					<dt class="font-bold">{examDetails.ev_reason}</dt>
					<dd class="text-sm opacity-50">Versuch</dd>
				</span>
			</div>
		{/if}

		{#if examDetails.ev_examdate}
			<div>
				<span class="badge-icon p-4 variant-soft-secondary"
					><i class="fa-solid fa-calendar"></i></span
				>
				<span class="flex-auto">
					<dt class="font-bold">
						{examDetails.ev_examdate.split('-').reverse().join('.')} ({examDetails.ev_exambegtime.slice(
							0,
							5
						)}-{examDetails.ev_examendtime.slice(0, 5)})
					</dt>
					<dd class="text-sm opacity-50">Prüfungstermin</dd>
				</span>
			</div>
		{/if}

		{#if examDetails.ev_instructor}
			<div>
				<span class="badge-icon p-4 variant-soft-secondary"
					><i class="fa-solid fa-user-tie"></i></span
				>
				<span class="flex-auto">
					<dt class="font-bold">{examDetails.ev_instructor}</dt>
					<dd class="text-sm opacity-50">Prüfer</dd>
				</span>
			</div>
		{/if}
	</dl>
{/if}
<div class="arrow bg-surface-100-800-token" />
