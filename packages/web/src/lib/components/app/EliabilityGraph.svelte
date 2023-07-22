<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { Svelvet, Node, Anchor } from 'svelvet';

	import EliabilityStatement from './EliabilityStatement.svelte';

	export let show = false;

	/** @type{number} */
	export let batchId;
	/** @type{number} */
	export let eliabilityId;

	// @ts-ignore
	let nodes = [],
		eStatementLookup = {};

	// @ts-ignore
	const toNodes = (data, x, y) => {
		let res = [
			{
				connections: data.parents.map((p) => p.eliabilityId),
				position: { x: x, y: y },
				...data
			}
		];

		for (let p of data.parents) {
			res = res.concat(toNodes(p, x - 300, y));
			y += 200;
		}

		return res;
	};

	onMount(async () => {
		const res = await fetch(`/api/tree?id=${eliabilityId}`);
		const tree = await res.json();
		nodes = toNodes(tree, 800, 0);
		eStatementLookup = nodes.reduce((r, a) => {
			r[a.batchId] = r[a.batchId] || false;
			return r;
		}, Object.create(null));
	});
</script>

{#if show}
	<div
		transition:fade={{ duration: 100 }}
		class="fixed w-full p-4 inset-0 h-screen overflow-y-auto bg-stone-900 bg-opacity-30 z-50"
	>
		<div
			class="bg-white p-6 border rounded-md shadow-sm max-w-6xl mx-auto lg:max-h-[36rem] lg:mt-12 overflow-y-auto space-y-4"
		>
			<div class="flex justify-between items-center">
				<p class="text-xl font-bold">Flow of eliabilities of batch B#{batchId}</p>
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
			<div class="h-96 border-2 border-slate-800">
				<Svelvet zoom={0.8}>
					{#each nodes as node}
						<Node id={node.eliabilityId} connections={node.connections} position={node.position}>
							<div class="absolute flex flex-col top-16 -left-1">
								<Anchor output />
							</div>
							<div class="bg-white border rounded-md p-4 space-y-2 font-sans">
								<p class="text-lg font-bold">{node.siteName}</p>
								<p class="font-medium">Batch ID: B#{node.batchId}</p>
								<p class="font-medium">Weight: {node.weight.toLocaleString()} tonnes</p>
								<p class="font-medium">Emissions: {node.totalEmissions.toLocaleString()} kgCO2e</p>
								<button
									class="btn btn-primary w-full mt-2"
									on:click={() =>
										(eStatementLookup[node.batchId] = !eStatementLookup[node.batchId])}
									>View eliability statement</button
								>
							</div>
							<div class="absolute flex flex-col top-16 left-[232px]">
								<Anchor input />
							</div>
						</Node>
					{/each}
				</Svelvet>
				{#each nodes as node}
					<EliabilityStatement
						bind:show={eStatementLookup[node.batchId]}
						eliability={node}
						batchId={node.batchId}
					/>
				{/each}
			</div>
		</div>
	</div>
{/if}

<style>
	:global(.svelvet-node) {
		--node-border-width: 0px;
		box-shadow: none;
	}
</style>
