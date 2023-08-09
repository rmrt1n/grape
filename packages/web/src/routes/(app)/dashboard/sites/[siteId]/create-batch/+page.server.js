import { fail } from '@sveltejs/kit';

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ fetch, request, locals }) => {
    const body = Object.fromEntries(await request.formData());
    const { weight, site_id, type, recipient } = body;
    const emissions = [body.scope1, body.scope2, body.scope3, body.scope4, body.scope5]
      .map((e, i) => ({ emission_value: e, scope: i + 1 }))
      .filter((e) => e.emission_value.length > 0)
      .map((e) => ({ ...e, emission_value: Number(e.emission_value) }));
    const parentBatches = body.parents
      .toString()
      .split(',')
      .map((e) => Number(e.trim()));
    const direct_emissions = emissions.reduce((acc, e) => acc + e.emission_value, 0);
    const total_emissions = direct_emissions;

    const { data: batch, error: err } = await locals.supabase
      .from('batches')
      .insert({ weight: Number(weight), site_id: Number(site_id), type })
      .select()
      .single();

    if (err) {
      console.log(err);
      return fail(500, { error: err.message });
    }

    const { data: eliability, error: err2 } = await locals.supabase
      .from('eliabilities')
      .insert({
        batch_id: batch.batch_id,
        recipient_site_id: Number(recipient),
        total_emissions,
        direct_emissions
      })
      .select()
      .single();

    if (err2) {
      console.log(err2);
      return fail(500, { error: err2.message });
    }

    const { error: err3 } = await locals.supabase
      .from('emissions')
      .insert(emissions.map((e) => ({ ...e, eliability_id: eliability.eliability_id })));

    if (err3) {
      console.log(err3);
      return fail(500, { error: err3.message });
    }

    // if there's upstream eliabilities, add to eliability_relationships table and update total emissions
    if (parentBatches) {
      const { data: parents, error: err4 } = await locals.supabase
        .from('eliabilities')
        .select('eliability_id')
        .in('batch_id', parentBatches);

      if (err4) {
        console.log(err4);
        return fail(400, { error: err4.message });
      }

      const { error: err5 } = await locals.supabase
        .from('eliability_relationships')
        .insert(
          parents.map((e) => ({ parent_id: e.eliability_id, child_id: eliability.eliability_id }))
        );

      if (err5) {
        console.log(err5);
        return fail(500, { error: err5.message });
      }

      // for case of mills producing pk, where the emissions associated with the ffbs required to
      // produce the pk have been transferred to cpo. this results in the eliability having 0
      // upstream eliabilities, but you can still view the source of the ffbs.
      if (!body.moved) {
        const { data: emissions, error: err6 } = await locals.supabase
          .from('eliabilities')
          .select('total_emissions')
          .in(
            'eliability_id',
            parents.map((e) => e.eliability_id)
          );

        if (err6) {
          console.log(err6);
          return fail(500, { error: err6.message });
        }

        const new_total_emissions =
          total_emissions + emissions.reduce((acc, e) => acc + e.total_emissions, 0);
        const { error } = await locals.supabase
          .from('eliabilities')
          .update({ total_emissions: new_total_emissions })
          .eq('eliability_id', eliability.eliability_id);

        if (error) {
          console.log(error);
          return fail(500, { error: error.message });
        }
      }
    }

    // push data to sawtooth
    // disable until for demo in case it breaks
    const res = await fetch(`/api/push-sawtooth?id=${eliability.eliability_id}`, {
      method: 'POST'
    });
    console.log(res);

    return { success: true };
  }
};
