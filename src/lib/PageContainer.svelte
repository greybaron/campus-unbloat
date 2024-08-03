<script lang="ts">
	export let add_class: string = '';
</script>

<div
	class="{add_class} p-2 sm:p-4 space-y-4 flex flex-grow-0
	flex-col pb-[48px] sm:pb-4 mx-auto"
>
	<slot />
</div>
