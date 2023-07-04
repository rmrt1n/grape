import { fail, redirect } from '@sveltejs/kit';

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, locals, url }) => {
		const body = Object.fromEntries(await request.formData());

		console.log('the fuck', url.origin)
		const { error: err } = await locals.supabase.auth.signInWithOtp({
			email: /** @type {string} */ (body.email),
			options: { emailRedirectTo: `${url.origin}/auth/callback` }
		});

		if (err) {
			if (err.status === 400) {
				return fail(400, {
					error: 'error: invalid email'
				});
			}
			return fail(500, {
				error: 'error: server error'
			});
		}

		throw redirect(303, '/dashboard');
	}
};
