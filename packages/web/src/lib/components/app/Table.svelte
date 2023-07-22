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

	/**
	 * @typedef {import('$lib/types').Site} Site
	 */

	/** @type {Site[]} */
	export let sites;

	/** @type {string} */
	export let title;

	/** @type {import('@tanstack/svelte-table').ColumnDef<Site>[]} */
	const columns = [
		{
			accessorKey: 'siteId',
			header: 'ID',
			cell: (info) => info.getValue()
		},
		{
			accessorKey: 'name',
			header: 'Site name',
			cell: (info) => info.getValue()
		},
		{
			accessorKey: 'type',
			header: 'Type',
			// @ts-ignore
			cell: (info) => [...info.getValue()][0].toUpperCase() + info.getValue().slice(1)
		},
		{
			accessorKey: 'location',
			header: 'Location',
			cell: (info) => info.getValue()
		}
	];

	let globalFilter = '';
	$: options.update((old) => ({ ...old, state: { ...old.state, globalFilter } }));

	const options = writable({
		data: sites,
		columns: columns,
		state: { globalFilter, pagination: { pageIndex: 0, pageSize: 10 } },
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		globalFilterFn: fuzzyFilter,
		getPaginationRowModel: getPaginationRowModel()
	});

	// @ts-ignore not sure how to fix this :(
	const table = createSvelteTable(options);

	let selected = '';
	$: options.update((old) => ({
		...old,
		state: { ...old.state, globalFilter: globalFilter + selected }
	}));

	const demoSites = [1];
	/** @param {number} id */
	const isDemoSite = (id) => demoSites.filter((i) => i === id).length > 0;
</script>

<div class="space-y-4">
	<div class="flex justify-between gap-2 flex-wrap">
		<h2 class="text-xl font-bold">{title}</h2>
		<div class="flex gap-2 flex-wrap">
			<div class="relative">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-5 h-5 absolute left-4 top-1.5"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
					/>
				</svg>
				<input
					bind:value={globalFilter}
					class="px-4 pl-11 py-1 border rounded bg-stone-50"
					placeholder="search"
				/>
			</div>
			<div class="relative">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-5 h-5 absolute left-4 top-1.5"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
					/>
				</svg>
				<select bind:value={selected} class="btn h-full pl-11">
					<option value=""> All</option>
					<option value="plantation"> Plantation</option>
					<option value="mill"> Mill</option>
					<option value="crusher"> Crusher</option>
					<option value="refinery"> Refinery</option>
				</select>
			</div>
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
						<th class="px-4 py-2" />
					</tr>
				{/each}
			</thead>
			<tbody>
				{#each $table.getRowModel().rows as row}
					<tr class="hover:bg-stone-100">
						{#each row.getVisibleCells() as cell}
							<td class="px-4 py-2 text-left">
								<svelte:component
									this={flexRender(cell.column.columnDef.cell, cell.getContext())}
								/>
							</td>
						{/each}
						<td class="px-4 py-2">
							<a
								href={`/dashboard/sites/${row.getValue('siteId')}`}
								class="inline-block btn btn-icon"
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
							</a>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<Pagination {table} {options} />
</div>
