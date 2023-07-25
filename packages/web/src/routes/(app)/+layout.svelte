<script>
	import '../../app.postcss';
	import Navbar from '$lib/components/app/Navbar.svelte';
	import { goto } from '$app/navigation';

	export let data;

	/** @type {import('@sveltejs/kit').SubmitFunction} */
	const signOut = async ({ cancel }) => {
		cancel();
		const { error } = await data.supabase.auth.signOut();
		if (error) {
			console.log(error);
		}
		goto('/');
	};
</script>

<Navbar {signOut} />
<main class="bg-stone-100 min-h-screen">
	<div class="mx-auto xl:container lg:px-16 xl:px-20 p-4 md:p-8">
		<slot />
	</div>
</main>
