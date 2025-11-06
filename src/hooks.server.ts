import { createInstance } from '$lib/pocketbase';
import type { Handle } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { redirect } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const pb = createInstance();

	// load the store data from the request cookie string
	pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');
	try {
		// get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
		if (pb.authStore.isValid) {
			await pb.collection('users').authRefresh();
		}
	} catch (_) {
		// clear the auth store on failed refresh
		pb.authStore.clear();
	}

	event.locals.pb = pb;
	//console.log('pb', pb.authStore);
	event.locals.user = pb.authStore.record;

	// 权限检查: admin 路由保护
	if (event.url.pathname.startsWith('/admin')) {
		if (!event.locals.user) {
			// 未登录,重定向到登录页
			throw redirect(303, '/auth/login');
		}
		
		const userRole = event.locals.user?.role;
		if (userRole !== 'admin') {
			// 非管理员,重定向到首页
			throw redirect(303, '/');
		}
	}

	const response = await resolve(event);

	// send back the default 'pb_auth' cookie to the client with the latest store state

	response.headers.set(
		'set-cookie',
		pb.authStore.exportToCookie({ httpOnly: false, sameSite: 'lax', secure: !dev })
	);

	return response;
};
