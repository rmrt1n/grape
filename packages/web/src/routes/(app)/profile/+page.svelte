<script>
	export let data;

	const { user } = data;
</script>

<div class="space-y-6">
	<h1 class="text-2xl font-bold">Edit profile</h1>

	<div class="bg-white border rounded-md shadow-sm p-6 max-w-3xl">
		<!-- TODO: add progressive enhancement to this form -->
		<form method="POST" class="flex flex-col gap-4">
			<div>
				<label for="email" class="block mb-2 text-sm font-medium">Email</label>
				<input
					id="email"
					type="email"
					class="px-4 py-1 border rounded bg-stone-50 w-full disabled:text-stone-500 disabled:cursor-not-allowed"
					placeholder="samaltman@email.com"
					value={user.email}
					disabled
				/>
			</div>
			<div>
				<label for="name" class="block mb-2 text-sm font-medium">Name</label>
				<input
					required
					id="name"
					name="name"
					class="px-4 py-1 border rounded bg-stone-50 w-full"
					placeholder="e.g. Sam Altman"
					bind:value={user.name}
				/>
			</div>
			<div>
				<label for="phone" class="block mb-2 text-sm font-medium">Phone</label>
				<input
					required
					id="phone"
					name="phone"
					class="px-4 py-1 border rounded bg-stone-50 w-full"
					placeholder="+60123662734"
					bind:value={user.phone}
				/>
			</div>
			<button type="submit" class="btn btn-primary flex-grow-0 w-max self-end">Save</button>
		</form>
	</div>
</div>
