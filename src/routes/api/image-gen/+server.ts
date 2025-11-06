import { json } from '@sveltejs/kit';
import { OpenAI } from 'openai';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

// 延迟初始化 OpenAI 客户端,只在需要时创建
function getOpenAIClient() {
	if (!env.OPENAI_API_KEY) {
		throw new Error('OPENAI_API_KEY is not configured');
	}
	return new OpenAI({
		apiKey: env.OPENAI_API_KEY
	});
}

export const POST: RequestHandler = async ({ request }) => {
	const { prompt, size = '1024x1024', quality = 'standard' } = await request.json();

	try {
		// 在使用时才初始化客户端
		const openai = getOpenAIClient();
		
		const result = await openai.images.generate({
			model: 'dall-e-3',
			prompt,
			size,
			quality,
			n: 1
		});

		// Defensive check for result
		if (!result.data || result.data.length === 0) {
			return json({ error: 'No image returned from OpenAI' }, { status: 500 });
		}

		return json({ type: 'image', data: result.data[0].url });
	} catch (err: any) {
		console.error('Image generation error:', err);
		return json({ error: err?.message || 'Unexpected error' }, { status: 500 });
	}
};
