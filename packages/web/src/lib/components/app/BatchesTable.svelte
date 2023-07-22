<script>
	import { writable } from 'svelte/store';
	import {
		createSvelteTable,
		getCoreRowModel,
		flexRender,
		getFilteredRowModel,
		getPaginationRowModel
	} from '@tanstack/svelte-table';

	import { fuzzyFilter } from '$lib/table';
	import Pagination from './Pagination.svelte';
	import EliabilityStatement from './EliabilityStatement.svelte';
	import EliabilityGraph from './EliabilityGraph.svelte';

	/**
	 * @typedef {import('$lib/types').Batch} Batch
	 */

	/** @type {Batch[]} */
	export let batches;

	let eStatementLookup = batches.reduce((r, a) => {
		r[a.batchId] = r[a.batchId] || false;
		return r;
	}, Object.create(null));

	let eGraphLookup = batches.reduce((r, a) => {
		r[a.batchId] = r[a.batchId] || false;
		return r;
	}, Object.create(null));

	/** @type {import('@tanstack/svelte-table').ColumnDef<Batch>[]} */
	const columns = [
		{
			accessorKey: 'batchId',
			header: 'Batch ID',
			cell: (info) => `B#${info.getValue()}`
		},
		{
			accessorKey: 'type',
			header: 'Type',
			cell: (info) => info.getValue().toUpperCase()
		},
		{
			accessorKey: 'weight',
			header: 'Net weight (tonne)',
			cell: (info) => info.getValue().toLocaleString()
		},
		{
			accessorFn: (c) => c.eliability.recipient.name,
			header: 'Recipient',
			cell: (info) => info.getValue()
		},
		{
			accessorFn: (c) => c.eliability,
			id: 'emission',
			header: 'Carbon footprint (kgCO2e)',
			cell: (info) => info.getValue().totalEmissions.toLocaleString()
		}
	];

	let globalFilter = '';
	$: options.update((old) => ({ ...old, state: { ...old.state, globalFilter } }));

	// @ts-ignore not sure how to fix this :(
	const options = writable({
		data: batches,
		columns: columns,
		state: { globalFilter, pagination: { pageIndex: 0, pageSize: 10 } },
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		globalFilterFn: fuzzyFilter,
		getPaginationRowModel: getPaginationRowModel()
	});

	const table = createSvelteTable(options);
</script>

<div class="space-y-4">
	<div class="flex justify-between gap-2 flex-wrap">
		<h2 class="text-xl font-bold">Batches list</h2>
		<div class="relative">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="w-5 h-5 absolute left-4 top-1.5"
			>
				<path
					fill-rule="evenodd"
					d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
					clip-rule="evenodd"
				/>
			</svg>
			<input
				bind:value={globalFilter}
				class="px-4 pl-11 py-1 border rounded bg-stone-50"
				placeholder="search"
			/>
		</div>
	</div>

	<div class="w-full border rounded shadow-sm overflow-auto">
		<table class="w-full">
			<thead class="bg-stone-200 w-full">
				{#each $table.getHeaderGroups() as headerGroup}
					<tr>
						{#each headerGroup.headers as header}
							<th class="px-4 py-2 text-left">
								{#if !header.isPlaceholder}
									<svelte:component
										this={flexRender(header.column.columnDef.header, header.getContext())}
									/>
								{/if}
							</th>
						{/each}
					</tr>
				{/each}
			</thead>
			<tbody>
				{#each $table.getRowModel().rows as row}
					<tr class="hover:bg-stone-100">
						{#each row.getVisibleCells() as cell}
							<td>
								<div
									class="flex gap-2 items-center px-4 py-2"
									class:justify-between={cell.column.id === 'emission'}
								>
									<svelte:component
										this={flexRender(cell.column.columnDef.cell, cell.getContext())}
									/>
									{#if cell.column.id == 'emission'}
										<div class="flex gap-2">
											<button
												title="View eliability statement"
												class="btn btn-icon"
												on:click={() =>
													(eStatementLookup[row.getValue('batchId')] =
														!eStatementLookup[row.getValue('batchId')])}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													stroke-width="1.5"
													stroke="currentColor"
													class="w-5 h-5"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
													/>
												</svg>
											</button>
											<EliabilityStatement
												bind:show={eStatementLookup[row.getValue('batchId')]}
												eliability={row.getValue('emission')}
												batchId={row.getValue('batchId')}
											/>

											<button
												title="View eliability flow graph"
												class="btn btn-icon"
												on:click={() =>
													(eGraphLookup[row.getValue('batchId')] =
														!eGraphLookup[row.getValue('batchId')])}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													stroke-width="1.5"
													stroke="currentColor"
													class="w-5 h-5"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33"
													/>
												</svg>
											</button>
											<EliabilityGraph
												bind:show={eGraphLookup[row.getValue('batchId')]}
												batchId={row.getValue('batchId')}
												eliabilityId={row.getValue('emission').eliabilityId}
											/>
										</div>
									{/if}
								</div>
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<Pagination {table} {options} />
</div>
