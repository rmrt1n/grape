import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals }) => {
	const session = await locals.getSession();

	const { data, error: err } = await locals.supabase
		.from('sites')
		.select('site_id, name, location, type, companies (company_id, name)')
		.eq('company_id', 1) // use 1 atm just for demo
		.order('site_id');

	if (err) {
		console.log(err);
		throw error(500, err.message);
	}

	const { data: user, error: err2 } = await locals.supabase
		.from('users')
		.select()
		.eq('id', session?.user.id)
		.single();

	if (err2) {
		console.log(err2);
		throw error(500, err2.message);
	}

	/** @type {import('$lib/types').Site[]} */
	const sites = data.map(({ site_id: siteId, companies: c, ...rest }) => ({
		siteId,
		// @ts-ignore, issue with postgrest-js, still being fixed, so ignore this in the meantime
		company: { companyId: c.company_id, name: c.name },
		...rest
	}));

	return {
		sites,
		user: user
	};
};
