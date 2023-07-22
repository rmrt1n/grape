import { json, error } from '@sveltejs/kit';
import { fmtEliability } from '$lib/types';

/** @type {import('./$types').RequestHandler} */
export const GET = async ({ url, locals }) => {
  if (!url.searchParams.get('id')) throw error(500, 'error: missing parameter "id"')
  if (isNaN(url.searchParams.get('id'))) throw error(500, 'error: "id" is not number')

  const id = Number(url.searchParams.get('id'));
  const res = await getTree(id, locals.supabase);

  return json(res)
}

/**
 * @param {number} eliabilityId
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @returns Promise<{import('$lib/types').EliabilityTree}>
 */
const getTree = async (eliabilityId, supabase) => {
  let { data: child } = await supabase
    .from('eliabilities')
    .select(
      `
        eliability_id, direct_emissions, total_emissions, batch_id, 
        batches(weight, sites(name)),
        emissions (emission_id, emission_value, scope)
      `
    )
    .eq('eliability_id', eliabilityId);

  // there should be only 1 eliability with id of id
  // this is an error of postgrest-js (issue is still being fixed)
  child = child?.map(fmtEliability)[0];

  const { data: parents } = await supabase
    .from('eliability_relationships')
    .select()
    .eq('child_id', eliabilityId);

  return {
    ...child,
    parents: await Promise.all(parents?.map(async (p) => await getTree(p.parent_id, supabase)))
  };
}
