<script>
	/** @type{string} */
	export let msg;

	export let fail = false;
	let show = true;
</script>

{#if show}
	<div
		class="fixed bottom-4 right-4 bg-white border rounded-md shadow-sm p-4 space-y-6 w-80 cursor-pointer break-words"
		on:click={() => (show = false)}
	>
		<p class={'font-medium ' + (fail ? 'text-red-700' : 'text-green-700')}>
			{!fail ? 'Action success' : 'Action failed'}
		</p>
		{msg}
	</div>
{/if}
