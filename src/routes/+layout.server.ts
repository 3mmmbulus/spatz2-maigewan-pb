import type { LayoutServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from '$lib/schema';

// Load this data everywhere
export const load: LayoutServerLoad = async ({ locals }) => {
	const notifications = await locals.pb.collection('notifications').getFullList({
		filter: `user ~ "${locals?.pb?.authStore?.record?.id}"`,
		sort: '-created'
	});

	return {
		user: locals.user,
		globalNotifications: notifications,
		form: await superValidate(zod(formSchema))
	};
};
