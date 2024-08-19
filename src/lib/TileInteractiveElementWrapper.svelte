<!-- this is a wrapper to stop event propagation, -->
<!-- so that the modal is not opened when interacting with tile elements. -->
<div role="presentation" on:click|stopPropagation={() => {}}>
	<slot />
</div>
