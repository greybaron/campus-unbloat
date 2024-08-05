<script>
	import { env } from '$env/dynamic/public';
</script>

<div class="container p-10 space-y-4">
	<h1 class="h1">Impressum</h1>
	<p>Angaben gemäß § 5 DDG</p>

	<p>
		{env.PUBLIC_IMPRESS_FULLNAME}<br />
		{env.PUBLIC_IMPRESS_STRASSE_HAUSNR}<br />
		{#if env.PUBLIC_IMPRESS_ADDRZUSATZ}
			{env.PUBLIC_IMPRESS_ADDRZUSATZ}<br />
		{/if}
		{env.PUBLIC_IMPRESS_ORT_PLZ}
	</p>

	<h2 class="h2">Kontakt</h2>
	<p>
		Telefon: {env.PUBLIC_IMPRESS_TELEFON}<br />
		E-Mail: {env.PUBLIC_IMPRESS_EMAIL}
	</p>
</div>
