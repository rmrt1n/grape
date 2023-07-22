<script>
	import { enhance } from '$app/forms';
	import { fmtSite } from '$lib/types.js';
	import { onMount } from 'svelte';

	import FormResultMessage from '$lib/components/app/FormResultMessage.svelte';

	/** @type{import('./$types').ActionData} */
	export let form;
	export let data;

	const { supabase, site } = data;

	/** @type {import('$lib/types').Site[]} */
	let recipients = [];

	onMount(async () => {
		if (site.type === 'refinery') return;

		const recipientSiteLookup = {
			plantation: ['mill'],
			mill: ['refinery', 'crusher'],
			crusher: ['refinery']
		};

		const { data, error } = await supabase
			.from('sites')
			.select('site_id, name, location, type')
			.in('type', recipientSiteLookup[site.type]);

		if (error) {
			console.log(error);
		}

		recipients = data?.map(fmtSite) ?? [];
	});

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

<div class="space-y-6">
	<div class="flex gap-4 items-center">
		<a href={`/dashboard/sites/${site.siteId}`} class="btn">
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

			Site
		</a>
		<h1 class="text-2xl font-bold">Create batch</h1>
	</div>

	<div class="bg-white border rounded-md shadow-sm p-6 max-w-3xl">
		<form method="POST" class="flex flex-col gap-4" use:enhance>
			<div>
				<label for="site" class="block mb-2 text-sm font-medium">Site name</label>
				<input
					id="site"
					class="px-4 py-1 border rounded bg-stone-50 w-full disabled:text-stone-500 disabled:cursor-not-allowed"
					value={site.name}
					disabled
				/>
			</div>
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
			{#if site.type !== 'refinery'}
				<div>
					<label for="recipient" class="block mb-2 text-sm font-medium">Recipient site</label>
					<select id="recipient" name="recipient" class="btn w-full" required>
						{#each recipients as r}
							<option value={r.siteId}>{r.name}</option>
						{/each}
					</select>
				</div>
			{/if}
			<div>
				<p class="block mb-2 text-sm font-medium">Direct emissions</p>
				<div class="space-y-2">
					{#each scopeLookup as s}
						<div class="flex gap-2">
							<p class="text-sm font-medium ml-6 inline-block">{s.ghgScope}.</p>
							<label for={`scope${s.id}`} class="mb-2 text-sm font-medium flex-1">{s.name}</label>
							<input
								id={`scope${s.id}`}
								name={`scope${s.id}`}
								type="number"
								step="any"
								class="px-4 py-1 border rounded bg-stone-50 flex-1 self-start"
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
					required={site.type !== 'plantation'}
					id="parents"
					name="parents"
					class="px-4 py-1 border rounded bg-stone-50 w-full"
					placeholder="1,2,3"
				/>
			</div>
			<div>
				<input id="moved" name="moved" type="checkbox" />
				<label for="moved" class="mb-2 text-sm font-medium"
					>E-liabilities moved to another batch</label
				>
			</div>
			<input hidden id="site_id" name="site_id" value={site.siteId} />
			<button type="submit" class="btn btn-primary flex-grow-0 w-max self-end">Create batch</button>
		</form>
	</div>
	{#if form?.success || form?.error}
		<FormResultMessage
			msg={form.error ? form.error : 'Batch created successfully'}
			fail={!form.success}
		/>
	{/if}
</div>
