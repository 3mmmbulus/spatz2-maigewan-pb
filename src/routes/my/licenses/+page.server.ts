import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.pb.authStore.isValid) {
		throw redirect(303, '/auth/login');
	}

	try {
		// 获取当前用户的授权列表
		const licenses = await locals.pb.collection('maigewan_licenses').getFullList({
			filter: `userRef = "${locals.pb.authStore.record?.id}"`,
			sort: '-created'
		});

		return {
			licenses
		};
	} catch (err) {
		console.error('Error fetching licenses:', err);
		return {
			licenses: []
		};
	}
};
