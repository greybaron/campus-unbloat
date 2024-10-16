<script lang="ts">
	export let add_class: string = '';
</script>

<!-- this is a wrapper to stop event propagation, -->
<!-- so that the modal is not opened when interacting with tile elements. -->
<div role="presentation" on:click|stopPropagation={() => {}} class="dont-open-modal {add_class}">
	<slot />
</div>
