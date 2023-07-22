<script>
	import { fade } from 'svelte/transition';

	export let show = false;

	/** @type {import('$lib/types').Site} */
	export let site;

	const typeLookup = {
		plantation: [{ id: 'ffb', name: 'Fresh fruit bunch (FFB)' }],
		mill: [
			{ id: 'cpo', name: 'Crude palm oil (CPO)' },
			{ id: 'pk', name: 'Palm kernel (PK)' }
		],
		crusher: [{ id: 'cpko', name: 'Crude palm kernel oil (CPKO)' }],
		refinery: [
			{ id: 'rpo', name: 'Refined palm oil (RPO)' },
			{ id: 'rpko', name: 'Refined palm kernel oil (RPKO)' }
		]
	};

	const scopeLookup = [
		{ id: 1, ghgScope: '1.1', name: 'Stationary combustion emissions' },
		{ id: 2, ghgScope: '1.2', name: 'Physical or chemical processing' },
		{ id: 3, ghgScope: '1.3', name: 'Fugitive emissions' },
		{ id: 4, ghgScope: '1.4', name: 'Transportation of materials, products, waste, and employees' },
		{ id: 5, ghgScope: '2.0', name: 'Emissions from purchased energy' }
	];
</script>

{#if show}
	<div
		transition:fade={{ duration: 100 }}
		class="fixed w-full p-4 inset-0 h-screen overflow-y-auto bg-stone-900 bg-opacity-30 z-50"
	>
		<div
			class="bg-white p-6 border rounded-md shadow-sm max-w-2xl mx-auto lg:max-h-[36rem] lg:mt-12 overflow-y-auto space-y-4"
		>
			<div class="flex justify-between items-center">
				<p class="text-xl font-bold">Create batch</p>
				<button on:click={() => (show = false)} class="btn btn-icon">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-5 h-5"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
			<form method="POST" class="flex flex-col gap-4">
				<div>
					<label for="weight" class="block mb-2 text-sm font-medium">Weight</label>
					<input
						required
						id="weight"
						name="weight"
						type="number"
						step="any"
						class="px-4 py-1 border rounded bg-stone-50 w-full"
						placeholder="10 tonnes"
					/>
				</div>
				<div>
					<label for="type" class="block mb-2 text-sm font-medium">Type</label>
					<select id="type" name="type" class="btn w-full" required>
						{#each typeLookup[site.type] as o}
							<option value={o.id}>{o.name}</option>
						{/each}
					</select>
				</div>
				<div>
					<label for="recipient_site_id" class="block mb-2 text-sm font-medium"
						>Recipient site ID</label
					>
					<input
						id="recipient_site_id"
						name="recipient_site_id"
						type="number"
						class="px-4 py-1 border rounded bg-stone-50 w-full"
						placeholder="1"
					/>
				</div>
				<div>
					<p class="block mb-2 text-sm font-medium">Direct emissions</p>
					<div class="space-y-2">
						{#each scopeLookup as s}
							<div class="flex gap-2">
								<p class="text-sm font-medium ml-6 inline-block">{s.ghgScope}.</p>
								<label for={s.id} class="mb-2 text-sm font-medium w-full">{s.name}</label>
								<input
									required
									id={s.id.toString()}
									name={s.id.toString()}
									type="number"
									step="any"
									class="px-4 py-1 border rounded bg-stone-50 w-full"
									placeholder="10,000.00 kgCO2e"
								/>
							</div>
						{/each}
					</div>
				</div>
				<div>
					<label for="parents" class="block mb-2 text-sm font-medium"
						>Upstream batch IDs (comma separated)</label
					>
					<input
						id="parents"
						name="parents"
						class="px-4 py-1 border rounded bg-stone-50 w-full"
						placeholder="1,2,3"
					/>
				</div>
				<button class="btn btn-primary mt-2">Create batch</button>
			</form>
		</div>
	</div>
{/if}
