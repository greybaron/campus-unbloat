<script lang="ts">
	export let title: string;
</script>

<div
	class="modal block overflow-y-auto bg-surface-100-800-token w-modal h-auto p-4 space-y-4 rounded-container-token shadow-xl"
	role="dialog"
>
	<header class="text-2xl font-bold">{title}</header>
	<slot name="body" />
	<footer class="modal-footer flex justify-end space-x-2">
		<slot name="optionalbuttons" />
	</footer>
</div>
