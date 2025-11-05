import { z } from 'zod';
import { Filter } from 'bad-words';

const filter = new Filter();

const imageTypes = [
	'image/jpeg',
	'image/jpg',
	'image/png',
	'image/webp',
	'image/svg+xml',
	'image/gif'
];

// ------------------------------
// REGISTER USER
// ------------------------------
export const registerUserSchema = z
	.object({
		email: z
			.string({ required_error: '邮箱为必填项' })
			.email({ message: '请输入有效的邮箱地址' }),
		password: z
			.string({ required_error: '密码为必填项' })
			.min(6, { message: '密码至少需要6个字符' }),
		passwordConfirm: z
			.string({ required_error: '确认密码为必填项' })
			.min(6, { message: '密码至少需要6个字符' })
	})
	.superRefine(({ passwordConfirm, password }, ctx) => {
		if (passwordConfirm !== password) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: '两次输入的密码必须一致',
				path: ['password']
			});
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: '两次输入的密码必须一致',
				path: ['passwordConfirm']
			});
		}
	});

export type RegisterUserSchema = typeof registerUserSchema;

// ------------------------------
// LOGIN USER
// ------------------------------
export const loginUserSchema = z.object({
	email: z
		.string({ required_error: '邮箱为必填项' })
		.email({ message: '请输入有效的邮箱地址' }),
	password: z.string({ required_error: '密码为必填项' })
});

export type LoginUserSchema = typeof loginUserSchema;

// ------------------------------
// UPDATE PASSWORD
// ------------------------------
export const updatePasswordSchema = z
	.object({
		oldPassword: z.string({ required_error: '当前密码为必填项' }),
		password: z
			.string({ required_error: '新密码为必填项' })
			.min(6, { message: '密码至少需要6个字符' }),
		passwordConfirm: z
			.string({ required_error: '确认新密码为必填项' })
			.min(6, { message: '密码至少需要6个字符' })
	})
	.superRefine(({ passwordConfirm, password }, ctx) => {
		if (passwordConfirm !== password) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: '两次输入的密码必须一致',
				path: ['password']
			});
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: '两次输入的密码必须一致',
				path: ['passwordConfirm']
			});
		}
	});

// ------------------------------
// PASSWORD RESET
// ------------------------------
export const resetPasswordSchema = z.object({
	email: z
		.string({ required_error: 'Email is required' })
		.email({ message: 'Email must be a valid email.' }),
	password: z.string({ required_error: 'Password is required' })
});

// ------------------------------
// UPDATE EMAIL
// ------------------------------
export const updateEmailSchema = z.object({
	email: z
		.string({ required_error: 'Email is required' })
		.email({ message: 'Email must be a valid email' })
});
export type UpdateEmailSchema = typeof updateEmailSchema;

// ------------------------------
// UPDATE USERNAME
// ------------------------------
export const updateUsernameSchema = z.object({
	username: z
		.string({ required_error: 'Username is required' })
		.min(3, { message: 'Username must be at least 3 characters' })
		.max(24, { message: 'Username must be 24 characters or less' })
		.regex(/^[a-zA-Z0-9]*$/, { message: 'Username can only contain letters or numbers.' })
});
export type UpdateUsernameSchema = typeof updateUsernameSchema;

// ------------------------------
// UPDATE PROFILE
// ------------------------------
export const updateProfileSchema = z.object({
	name: z
		.string({ required_error: 'Name is required' })
		.min(1, { message: 'Name is required' })
		.max(64, { message: 'Name must be 64 characters or less' })
		.trim(),

	job_title: z
		.string({ required_error: 'Job Title is required' })
		.min(1, { message: 'Job Title is required' })
		.max(64, { message: 'Job Title must be 64 characters or less' })
		.trim(),

	website: z.string().url({ message: 'Must be a valid URL' }).optional(), // Optional if users aren't required to enter a website

	avatar: z
		.instanceof(Blob)
		.optional()
		.superRefine((val, ctx) => {
			if (val) {
				if (val.size > 5242880) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Avatar must be less than 5MB'
					});
				}

				if (!imageTypes.includes(val.type)) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Unsupported file type. Supported formats: jpeg, jpg, png, webp, svg, gif'
					});
				}
			}
		})
});

// ------------------------------
//FOLLOW USER
// ------------------------------

export const followUserSchema = z.object({
	userId: z.string(),
	currentUserId: z.string()
});

export type FollowUserSchema = typeof followUserSchema;

// ------------------------------
//  CONTACT FORM
// ------------------------------
export const formSchema = z.object({
	firstName: z
		.string()
		.min(2, { message: '名字至少需要2个字符' })
		.max(50, { message: '名字最多50个字符' })
		.refine((value) => !filter.isProfane(value), {
			message: '名字包含不当内容'
		}),
	lastName: z
		.string()
		.min(2, { message: '姓氏至少需要2个字符' })
		.max(50, { message: '姓氏最多50个字符' })
		.refine((value) => !filter.isProfane(value), {
			message: '姓氏包含不当内容'
		}),
	email: z.string().email({ message: '请输入有效的邮箱地址' }),
	type: z
		.string()
		.min(2, { message: '请选择类型' })
		.max(50, { message: '请选择类型' }),
	priority: z
		.string()
		.min(1, { message: '请选择优先级' })
		.max(2, { message: '请选择优先级' }),
	message: z
		.string()
		.min(10, { message: '留言至少需要10个字符' })
		.max(500, { message: '留言最多500个字符' })
		.refine((value) => !filter.isProfane(value), {
			message: '留言包含不当内容'
		})
});

export type FormSchema = typeof formSchema;

// ------------------------------
// CREATE GUEST BOOK POST
// ------------------------------
export const createGuestBookPostSchema = z.object({
	author: z.string().refine((value) => !filter.isProfane(value), {
		message: 'Author name contains inappropriate language'
	}),
	content: z
		.string({ required_error: 'Message is required' })
		.min(1, { message: 'Message must be at least 1 character' })
		.max(250, { message: 'Message must be 250 characters or less' })
		.refine((value) => !filter.isProfane(value), {
			message: 'Message contains inappropriate language'
		})
});

// ------------------------------
// CREATE POST COMMENT
// ------------------------------
export const createPostCommentSchema = z.object({
	author: z.string(),
	content: z
		.string({ required_error: 'Message is required' })
		.min(1, { message: 'Message must be at least 1 character' })
		.max(250, { message: 'Message must be 250 characters or less' })
		.refine((value) => !filter.isProfane(value), {
			message: 'Message contains inappropriate language'
		}),
	post: z.string()
});

// ------------------------------
// LIKE GUEST BOOK POST
// ------------------------------
export const likeGuestBookPostSchema = z.object({
	postId: z.string(),
	currentUserId: z.string()
});

// ------------------------------
// DELETE GUEST BOOK POST
// ------------------------------
export const deleteGuestBookPostSchema = z.object({
	postId: z.string()
});

// ------------------------------
// DELETE POST COMMENT
// ------------------------------
export const deletePostCommentSchema = z.object({
	post: z.string()
});

// ------------------------------
// DELETE NOTIFICATION
// ------------------------------
export const deleteNotificationSchema = z.object({
	notificationId: z.string()
});
