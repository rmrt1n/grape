<script>
	import { onMount } from 'svelte';
	import { fade, slide } from 'svelte/transition';

	export let show = false;

	/** @type {import('$lib/types').Eliability} */
	export let eliability;

	/** @type {number} */
	export let batchId;

	/** @type {{ batchId: number; totalEmissions: number; name: string; }[]} */
	let upstream = [];

	onMount(async () => {
		const res = await fetch(`/api/upstream?id=${eliability.eliabilityId}`);
		upstream = await res.json();
	});

	const openingEliability = 0; // TODO: research where to get this
	const upstreamEmissions = eliability.totalEmissions - eliability.directEmissions;
	const deltaEliability = eliability.totalEmissions - openingEliability;

	let showDetails = false;
	let showUpstreamDetails = false;

	/**
	 * @param {number} scope
	 * @returns string
	 */
	const fmtScope = (scope) => {
		const lookup = [
			'Stationary combustion emissions',
			'Physical or chemical processing',
			'Fugitive emissions',
			'Transportation of materials, products, waste, and employees',
			'Emissions from purchased energy'
		];
		return lookup[scope - 1];
	};
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
				<p class="text-xl font-bold">B#{batchId} E-Liability Statement</p>
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

			<div class="border rounded shadow-sm overflow-auto font-base">
				<div class="px-4 py-2 bg-stone-800 text-white font-bold flex justify-between">
					<p>E-liability flows</p>
					<p>kg of CO2e</p>
				</div>
				<div
					class="px-4 py-2 border-b-2 border-dashed border-stone-300 font-medium flex justify-between"
				>
					<p>Opening E-liabilities</p>
					<p class="text-right">{openingEliability.toLocaleString()}</p>
				</div>
				<div
					on:click={() => (showUpstreamDetails = !showUpstreamDetails)}
					on:keypress={() => (showUpstreamDetails = !showUpstreamDetails)}
					class="px-4 py-1 bg-stone-100 border-b-2 border-dashed border-stone-300 flex justify-between hover:cursor-pointer"
				>
					<p>Add E-liabilities acquired from suppliers</p>
					<div class="flex gap-2 items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							class="w-5 h-5"
							class:hidden={upstreamEmissions === 0}
						>
							<path
								fill-rule="evenodd"
								d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
								clip-rule="evenodd"
							/>
						</svg>
						<p class="text-right">
							{upstreamEmissions.toLocaleString()}
						</p>
					</div>
				</div>
				{#if showUpstreamDetails && upstreamEmissions !== 0}
					{#each upstream as u}
						<div
							transition:slide={{ duration: 150 }}
							class="px-4 py-1 bg-stone-100 border-b-2 border-dashed border-stone-300 flex justify-between"
						>
							<p class="pl-6">{u.name} B#{u.batchId}</p>
							<p class="text-right">{u.totalEmissions.toLocaleString()}</p>
						</div>
					{/each}
				{/if}
				<div
					on:click={() => (showDetails = !showDetails)}
					on:keypress={() => (showDetails = !showDetails)}
					class="px-4 py-1 bg-stone-100 border-b-2 border-dashed border-stone-300 flex justify-between hover:cursor-pointer"
				>
					<p>Add E-liabilities acquired from activities</p>
					<div class="flex gap-2 items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							class="w-5 h-5"
						>
							<path
								fill-rule="evenodd"
								d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
								clip-rule="evenodd"
							/>
						</svg>
						<p class="text-right">{eliability.directEmissions.toLocaleString()}</p>
					</div>
				</div>
				{#if showDetails}
					{#each eliability.emissions as e}
						<div
							transition:slide={{ duration: 150 }}
							class="px-4 py-1 bg-stone-100 border-b-2 border-dashed border-stone-300 flex justify-between"
						>
							<p class="pl-6">{fmtScope(e.scope)}</p>
							<p class="text-right">{e.emissionValue.toLocaleString()}</p>
						</div>
					{/each}
				{/if}
				<div
					class="px-4 py-2 font-medium border-b-2 border-dashed border-stone-300 flex justify-between"
				>
					<p>Closing E-liabilities</p>
					<p class="text-right">{eliability.totalEmissions.toLocaleString()}</p>
				</div>
				<div class="px-4 py-1 bg-stone-100 flex justify-between">
					<p>Change in E-liabilities during period</p>
					<p class="text-right">{deltaEliability.toLocaleString()}</p>
				</div>
			</div>
		</div>
	</div>
{/if}
