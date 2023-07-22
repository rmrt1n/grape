import { error } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals }) => {
  const session = await locals.getSession();

  const { data: user, error: err } = await locals.supabase
    .from('users')
    .select()
    .eq('id', session?.user.id)
    .single()

  if (err) {
    console.log(err)
    throw error(500, err.message)
  }

  return {
    user
  }
}

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request, locals }) => {
    const session = await locals.getSession();
    const body = Object.fromEntries(await request.formData());

    if (body.phone.toString().match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im) === null) {
      return fail(400, {
        error: 'error: invalid phone number format'
      })
    }

    const { error: err } = await locals.supabase
      .from('users')
      .update(body)
      .eq('id', session?.user.id)

    if (err) {
      return fail(500, {
        error: err.message
      });
    }

    return { success: true }
  }
};

