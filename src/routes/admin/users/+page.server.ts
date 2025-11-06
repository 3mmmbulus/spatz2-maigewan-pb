import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, url }) => {
	// 二次权限验证(虽然 hooks.server.ts 已经检查过,但这里再次确认)
	if (!locals.user || locals.user.role !== 'admin') {
		throw redirect(303, '/');
	}

	const page = Number(url.searchParams.get('page')) || 1;
	const perPage = 20;
	const search = url.searchParams.get('search') || '';

	try {
		// 构建过滤器
		let filter = '';
		if (search) {
			filter = `username ~ "${search}" || email ~ "${search}" || name ~ "${search}"`;
		}

		// 方案:直接使用原始 HTTP 请求,绕过 PocketBase SDK 的 emailVisibility 限制
		// 管理员可以通过在请求头中添加 auth token 来获取完整数据
		const response = await fetch(
			`${locals.pb.baseUrl}/api/collections/users/records?page=${page}&perPage=${perPage}&sort=-created${filter ? `&filter=${encodeURIComponent(filter)}` : ''}`,
			{
				headers: {
					Authorization: locals.pb.authStore.token
				}
			}
		);

		if (!response.ok) {
			throw new Error('Failed to fetch users');
		}

		const data = await response.json();

		return {
			users: data.items,
			totalPages: data.totalPages || Math.ceil(data.totalItems / perPage),
			totalItems: data.totalItems,
			currentPage: page,
			search: search
		};
	} catch (err) {
		console.error('Failed to fetch users:', err);
		throw error(500, '获取用户列表失败');
	}
};
