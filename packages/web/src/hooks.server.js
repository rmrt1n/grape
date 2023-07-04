import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import { redirect } from '@sveltejs/kit';

import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';

/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ({ event, resolve }) => {
	event.locals.supabase = createSupabaseServerClient({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event
	});

	event.locals.getSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		return session;
	};

	// protect requests to all routes in /(app)
	const path = event.url.pathname;
	if (path.startsWith('/dashboard') || path.startsWith('/profile')) {
		const session = await event.locals.getSession();
		if (!session) throw redirect(303, '/sign-in');
	}

	// redirect from /sign-in if user is already signed in
	if (path.startsWith('/sign-in')) {
		const session = await event.locals.getSession();
		if (session) throw redirect(303, '/dashboard');
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
};
