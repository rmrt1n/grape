<script>
	import Table from '$lib/components/app/Table.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
	const { sites, user } = data;
</script>

<div class="space-y-8">
	<h1 class="text-2xl font-bold">Welcome, {user?.name ?? user?.email}</h1>

	<div class="bg-white border rounded-md shadow-sm p-6">
		<Table {sites} title="Sites list" />
	</div>
</div>
