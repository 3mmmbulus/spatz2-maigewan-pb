import type { PageServerLoad, Actions } from './$types';
import { fail, error, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { loginUserSchema } from '$lib/schema';
import type { Action } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(loginUserSchema))
	};
};

// 获取客户端真实IP地址
function getClientIp(request: Request): string {
	// 优先从代理头获取真实IP
	const forwardedFor = request.headers.get('x-forwarded-for');
	if (forwardedFor) {
		// x-forwarded-for 可能包含多个IP，遍历找到第一个有效的IPv4地址
		const ips = forwardedFor.split(',').map(ip => ip.trim());
		for (const ip of ips) {
			// 优先返回IPv4地址（排除IPv6和内网地址）
			if (isValidPublicIPv4(ip)) {
				return ip;
			}
		}
		// 如果没有找到IPv4，返回第一个IP
		if (ips.length > 0 && ips[0]) {
			return ips[0];
		}
	}
	
	const realIp = request.headers.get('x-real-ip');
	if (realIp) {
		return realIp.trim();
	}
	
	const cfConnectingIp = request.headers.get('cf-connecting-ip');
	if (cfConnectingIp) {
		return cfConnectingIp.trim();
	}
	
	// 兜底：返回未知
	return 'unknown';
}

// 验证是否为有效的公网IPv4地址
function isValidPublicIPv4(ip: string): boolean {
	// IPv4 正则表达式
	const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
	
	if (!ipv4Regex.test(ip)) {
		return false;
	}
	
	const parts = ip.split('.').map(Number);
	
	// 检查每个部分是否在0-255范围内
	if (parts.some(part => part < 0 || part > 255)) {
		return false;
	}
	
	// 排除私有IP和特殊IP段
	const firstOctet = parts[0];
	const secondOctet = parts[1];
	
	// 排除以下范围：
	// 10.0.0.0 - 10.255.255.255 (私有网络)
	if (firstOctet === 10) return false;
	
	// 172.16.0.0 - 172.31.255.255 (私有网络)
	if (firstOctet === 172 && secondOctet >= 16 && secondOctet <= 31) return false;
	
	// 192.168.0.0 - 192.168.255.255 (私有网络)
	if (firstOctet === 192 && secondOctet === 168) return false;
	
	// 127.0.0.0 - 127.255.255.255 (回环地址)
	if (firstOctet === 127) return false;
	
	// 0.0.0.0 - 0.255.255.255 (无效地址)
	if (firstOctet === 0) return false;
	
	// 169.254.0.0 - 169.254.255.255 (链路本地地址)
	if (firstOctet === 169 && secondOctet === 254) return false;
	
	// 224.0.0.0 - 239.255.255.255 (组播地址)
	if (firstOctet >= 224 && firstOctet <= 239) return false;
	
	// 240.0.0.0 - 255.255.255.255 (保留地址)
	if (firstOctet >= 240) return false;
	
	return true;
}

// 记录登录日志
async function logLoginAttempt(
	pb: any,
	userId: string | null,
	ip: string,
	success: boolean
): Promise<void> {
	try {
		// 使用管理员权限创建日志（绕过权限规则）
		await pb.collection('maigewan_login_logs').create({
			userRef: userId || null,
			ip: ip,
			success: success
		});
	} catch (err) {
		// 日志写入失败不应影响登录流程，只记录错误
		console.error('Failed to write login log:', err);
	}
}

export const actions: Actions = {
	default: (async ({ request, locals }) => {
		const form = await superValidate(request, zod(loginUserSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		// 获取客户端IP
		const clientIp = getClientIp(request);
		
		// 调试日志：输出所有IP相关的请求头
		console.log('=== Login IP Debug Info ===');
		console.log('x-forwarded-for:', request.headers.get('x-forwarded-for'));
		console.log('x-real-ip:', request.headers.get('x-real-ip'));
		console.log('cf-connecting-ip:', request.headers.get('cf-connecting-ip'));
		console.log('Detected IP:', clientIp);
		console.log('===========================');
		
		let userId: string | null = null;

		try {
			// 尝试登录
			await locals.pb.collection('users').authWithPassword(form.data.email, form.data.password);
			
			if (!locals.pb?.authStore?.record) {
				// 登录失败：账户未验证
				locals.pb.authStore.clear();
				
				// 记录登录失败日志（userRef 为 null）
				await logLoginAttempt(locals.pb, null, clientIp, false);
				
				return {
					notVerified: true
				};
			}
			
			// 登录成功：获取用户ID
			userId = locals.pb.authStore.record.id;
			
			// 记录登录成功日志
			await logLoginAttempt(locals.pb, userId, clientIp, true);
			
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			console.log('Error: ', err);
			
			// 登录失败：记录日志（userRef 为 null，因为无法确定用户）
			await logLoginAttempt(locals.pb, null, clientIp, false);
			
			throw error(err.status, err.message);
		}

		throw redirect(303, '/');
	}) as Action
};
