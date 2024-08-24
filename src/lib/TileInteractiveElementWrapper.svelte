<script lang="ts">
	export let add_class: string = '';
</script>

<!-- this is a wrapper to stop event propagation, -->
<!-- so that the modal is not opened when interacting with tile elements. -->
<div role="presentation" on:click|stopPropagation={() => {}} class={add_class}>
	<slot />
</div>
