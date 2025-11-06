import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.pb.authStore.isValid || !locals.pb.authStore.record) {
		throw redirect(303, '/auth/login');
	}

	const userId = locals.pb.authStore.record.id;
	if (!userId) {
		throw redirect(303, '/auth/login');
	}

	try {
		// 获取当前用户的登录日志，按创建时间倒序排列
		const loginLogs = await locals.pb.collection('maigewan_login_logs').getFullList({
			filter: `userRef = "${userId}"`,
			sort: '-created',
			expand: 'userRef'
		});

		return {
			loginLogs
		};
	} catch (err) {
		console.error('Error fetching login logs:', err);
		return {
			loginLogs: []
		};
	}
};
