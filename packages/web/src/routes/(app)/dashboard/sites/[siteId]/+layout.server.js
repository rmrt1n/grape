import { error } from '@sveltejs/kit';

import { fmtBatch, fmtSite } from '$lib/types';

/** @type {import('./$types').LayoutServerLoad} */
export const load = async ({ params, locals }) => {
	const { siteId } = params;

	const { data: sites, error: err } = await locals.supabase
		.from('sites')
		.select('site_id, name, location, type')
		.eq('site_id', siteId);

	if (err) {
		console.log(err);
		throw error(500, err.message);
	}

	const { data, error: err2 } = await locals.supabase
		.from('batches')
		.select(
			`
      batch_id, weight, site_id, type, created_at,
      eliabilities (
        eliability_id, total_emissions, direct_emissions,
        sites (
          site_id, name, location, type
        ),
        emissions (
          emission_id, emission_value, scope
        )
      )
  	`
		)
		.eq('site_id', siteId);

	if (err2) {
		console.log(err2);
		throw error(500, err2.message);
	}

	/** @type{import('$lib/types').Batch[]} */
	const batches = data.map(fmtBatch);

	/** @type{import('$lib/types').Site} */
	const site = sites.map(fmtSite)[0];

	return { site, batches };
};
