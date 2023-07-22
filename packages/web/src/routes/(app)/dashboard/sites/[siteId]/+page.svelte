<script>
	import BatchesTable from '$lib/components/app/BatchesTable.svelte';
	import { fmtEmission } from '$lib/types';

	/** @type {import('./$types').PageData} */
	export let data;
	const { site, batches } = data;

	const batchesThisMonth = batches.filter((b) => b.createdAt.getMonth() === new Date().getMonth());
</script>

<div class="space-y-4">
	<div class="flex justify-between items-center">
		<div class="flex items-center gap-4">
			<a href="/dashboard" class="btn">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="w-5 h-5"
				>
					<path
						fill-rule="evenodd"
						d="M7.793 2.232a.75.75 0 01-.025 1.06L3.622 7.25h10.003a5.375 5.375 0 010 10.75H10.75a.75.75 0 010-1.5h2.875a3.875 3.875 0 000-7.75H3.622l4.146 3.957a.75.75 0 01-1.036 1.085l-5.5-5.25a.75.75 0 010-1.085l5.5-5.25a.75.75 0 011.06.025z"
						clip-rule="evenodd"
					/>
				</svg>

				Dashboard
			</a>
			<h1 class="text-2xl font-bold">{site.name}</h1>
		</div>
		<a href={`./${site.siteId}/create-batch`} class="btn btn-primary">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-5 h-5"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
			</svg>

			Create batch
		</a>
	</div>
	<div class="flex flex-col sm:flex-row gap-2">
		<div class="bg-white border rounded-md shadow-sm p-4 space-y-2 w-full">
			<h2 class="text-xl font-medium">Total transactions</h2>
			<p class="text-3xl font-bold">{batches.length}</p>
			<p class="text-lg font-medium">
				{batchesThisMonth.length} transactions this month
			</p>
		</div>
		<div class="bg-white border rounded-md shadow-sm p-4 space-y-2 w-full">
			<h2 class="text-xl font-medium">Total produce weight</h2>
			<p class="text-3xl font-bold">
				{batches.reduce((acc, i) => acc + i.weight, 0).toLocaleString()} tonnes
			</p>
			<p class="text-lg font-medium">
				{batchesThisMonth.reduce((acc, i) => acc + i.weight, 0).toLocaleString()} tonnes this month
			</p>
		</div>
		<div class="bg-white border rounded-md shadow-sm p-4 space-y-2 w-full">
			<h2 class="text-xl font-medium">Total emissions</h2>
			<p class="text-3xl font-bold">
				{batches.reduce((acc, i) => acc + i.eliability.totalEmissions, 0).toLocaleString()} kgCO2e
			</p>
			<p class="text-lg font-medium">
				{batchesThisMonth.reduce((acc, i) => acc + i.eliability.totalEmissions, 0).toLocaleString()}
				kgCO2e this month
			</p>
		</div>
	</div>
	<div class="bg-white border rounded-md shadow-sm p-4 space-y-2 w-full">
		{#if batches.length > 0}
			<BatchesTable {batches} />
		{:else}
			<div class="flex flex-col items-center justify-center">
				<img src="/60-failure.svg" alt="no result found" class="h-72" />
				<h2 class="text-2xl font-bold mb-4">No data for this site</h2>
			</div>
		{/if}
	</div>
</div>
