<script>
	import { slide } from 'svelte/transition';
	const features = [
		{
			title: 'Automated accounting',
			img: '/271-factory-worker.svg',
			details: [
				'Automated proccesses are less error-prone',
				'E-liability accounting & statements generator',
				'Immutability of transaction records through blockchain'
			]
		},
		{
			title: 'Transparent auditing',
			img: '/58-teamwork.svg',
			details: [
				'Transactions are pulic to all members of the supply chain',
				'E-liabilities provide a robust audit trail',
				'Highest level of data integrity'
			]
		},
		{
			title: 'Systems integration',
			img: '/104-human-resource.svg',
			details: [
				'Integrates with SAP S/4HANA, SAP ARIBA, and other ERP systems',
				'Import existing product & supplier data',
				'Custom carbon emissions factor database'
			]
		}
	];

	let faqs = [
		{
			isOpen: false,
			question: 'What is grape?',
			answer:
				'grape is a carbon accounting platform specifically designed for the palm oil industry. It uses the e-liability accounting approach to help companies measure and manage their carbon emissions in more detail.'
		},
		{
			isOpen: false,
			question: 'How is grape different from competitors in the market?',
			answer:
				'Our software provides a higher level of granularity in measuring emissions than many of our competitors, enabling businesses to identify emission hotspots and opportunities for improvement with greater accuracy. We also offer a modern user interface that is accessible and easy to use.'
		},
		{
			isOpen: false,
			question: 'What features does grape have?',
			answer:
				'grape offers a range of powerful features, including carbon accounting tools, emission tracking, and sustainability reporting. You can calculate your carbon footprint, analyze your supply chain, and generate detailed reports to showcase your sustainability efforts.'
		},
		{
			isOpen: false,
			question: 'What does grape stand for?',
			answer:
				'grape stands for Generalised Reporting and Accounting Platform for Palm oil E-liabilities'
		}
	];
</script>

<div class="space-y-16 sm:space-y-20 lg:space-y-28">
	<div class="pt-12 sm:pt-16 lg:pt-24 text-center">
		<h1 class="font-display font-semibold text-4xl sm:text-6xl lg:text-7xl max-w-5xl mx-auto">
			Take control of your products' carbon footprint
		</h1>
		<p class="max-w-3xl mx-auto mt-6 text-xl font-medium">
			Measure, analyze, and optimize your sustainability efforts with our carbon management software
		</p>
		<a href="mailto:hi@ryanmartin.me" class="btn btn-primary px-8 py-3 mt-6 font-medium text-lg">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-6 h-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
				/>
			</svg>
			Get in touch
		</a>
		<img
			src="/product.png"
			alt="product mockup"
			class="w-full lg:max-w-5xl m-auto mt-16 rounded-lg shadow-2xl"
		/>
	</div>

	<div>
		<h2 class="font-display font-semibold text-4xl sm:text-5xl text-center max-w-5xl mx-auto">
			Why use <span class="text-blue-700">grape</span> ?
		</h2>
		<div class="w-full flex flex-col md:flex-row justify-between gap-8 mt-6">
			{#each features as f}
				<div class="flex md:flex-col items-center w-full">
					<img src={f.img} alt={'illust. for ' + f.title} class="hidden md:block lg:w-full -my-8" />
					<div>
						<p
							class="font-display font-semibold text-3xl sm:text-4xl md:text-center max-w-5xl mx-auto"
						>
							{f.title}
						</p>
						<div class="mt-4 space-y-2">
							{#each f.details as d}
								<div class="flex gap-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="currentColor"
										class="w-6 h-6 text-blue-700"
									>
										<path
											fill-rule="evenodd"
											d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
											clip-rule="evenodd"
										/>
									</svg>
									<p class="flex-1">{d}</p>
								</div>
							{/each}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<div>
		<div class="flex flex-col-reverse md:flex-row md:justify-between gap-4 md:gap-12 md:h-96">
			<div class="max-w-3xl space-y-6">
				<h2 class="font-display font-semibold text-4xl sm:text-5xl">
					We help you decarbonize your supply chain, one site at a time
				</h2>
				<p class="text-lg">
					Scope 3 is especially dificult to measure, yet alone manage. We help you setup accurate
					measurements and provide you the tools to reduce your produce's carbon footprints.
				</p>
			</div>
			<img src="/palm.jpg" alt="palm fruit" class="h-64 md:h-full w-full rounded-lg object-cover" />
		</div>
	</div>

	<div class="pb-12 sm:pb-16 lg:pb-24 text-center">
		<h2
			id="faq"
			class="font-display font-semibold text-4xl sm:text-5xl text-center max-w-5xl mx-auto"
		>
			Frequently asked questions
		</h2>
		<div class="max-w-4xl mx-auto text-lg mt-6">
			{#each faqs as f}
				<div
					on:click={() => (f.isOpen = !f.isOpen)}
					on:keydown={() => (f.isOpen = !f.isOpen)}
					class="py-4 border-b hover:cursor-pointer flex items-center justify-between text-left"
				>
					{f.question}
					{#if f.isOpen}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
						</svg>
					{:else}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M19.5 8.25l-7.5 7.5-7.5-7.5"
							/>
						</svg>
					{/if}
				</div>
				{#if f.isOpen}
					<div transition:slide={{ duration: 150 }} class="py-4 border-b text-left">
						{f.answer}
					</div>
				{/if}
			{/each}
		</div>
	</div>
</div>
