import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { USDT_TRC20_ADDRESS, USDT_ERC20_ADDRESS, LICENSE_PRICE } from '$env/static/private';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.pb.authStore.isValid || !locals.pb.authStore.record) {
		throw redirect(303, '/auth/login');
	}

	const userId = locals.pb.authStore.record.id;
	if (!userId) {
		throw redirect(303, '/auth/login');
	}

	try {
		// 获取当前用户的授权列表
		const licenses = await locals.pb.collection('maigewan_licenses').getFullList({
			filter: `userRef = "${userId}"`,
			sort: '-created'
		});

		return {
			licenses,
			payment: {
				trc20Address: USDT_TRC20_ADDRESS || '',
				erc20Address: USDT_ERC20_ADDRESS || '',
				price: LICENSE_PRICE || '700'
			}
		};
	} catch (err) {
		console.error('Error fetching licenses:', err);
		return {
			licenses: [],
			payment: {
				trc20Address: '',
				erc20Address: '',
				price: '700'
			}
		};
	}
};
