import { json, error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export const GET = async ({ url, locals }) => {
  if (!url.searchParams.get('id')) throw error(500, 'error: missing parameter "id"')
  if (isNaN(url.searchParams.get('id'))) throw error(500, 'error: "id" is not number')

  const id = Number(url.searchParams.get('id'));
  const res = await getUpstreamEliability(id, locals.supabase);

  return json(res)
}

/**
 * @param {number} eliabilityId
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @returns Promise<{totalEmissions: number; name: string;}>
 */
const getUpstreamEliability = async (eliabilityId, supabase) => {
  const { data, error } = await supabase
    .from('eliability_relationships')
    .select('parent_id(batch_id, total_emissions, batches(sites(name))))')
    .eq('child_id', eliabilityId);

  if (error) {
    console.log(error.message);
  }

  return data.map((i) => ({
    batchId: i.parent_id.batch_id,
    totalEmissions: i.parent_id.total_emissions,
    name: i.parent_id.batches.sites.name
  }));
};
