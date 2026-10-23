import { defineCollection, z } from "astro:content";

/**
 * 分类字段的容错解析。
 *
 * 手写 frontmatter 时很容易写成 `category: 游戏源码`（字符串）而不是
 * `category: ["游戏源码"]`（数组）。若 schema 严格只接受数组，Astro 会在
 * 同步内容阶段抛 InvalidContentEntryDataError，**直接中断整个构建**，
 * 导致所有页面（含首页）都无法产出，线上表现为「整站没更新」。
 *
 * 这里用 preprocess 把字符串 / 数组 / 空值统一规范化为字符串数组，
 * 既兼容两种写法，又不会让单篇文章的笔误拖垮整站。
 */
const categorySchema = z
	.preprocess((val: unknown): string[] => {
		if (val === undefined || val === null) return [];
		if (Array.isArray(val)) {
			return val.map((v) => String(v).trim()).filter(Boolean);
		}
		const s = String(val).trim();
		return s ? [s] : [];
	}, z.array(z.string()))
	.optional()
	.default([]);

const postsCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		published: z.date(),
		updated: z.date().optional(),
		draft: z.boolean().optional().default(false),
		description: z.string().optional().default(""),
		image: z.string().optional().default(""),
		tags: z.array(z.string()).optional().default([]),
		category: categorySchema,
		lang: z.string().optional().default(""),
		pinned: z.boolean().optional().default(false),
		/** 是否开启评论（保留字段，兼容其他来源的写法） */
		comment: z.boolean().optional().default(true),

		/* For internal use */
		prevTitle: z.string().default(""),
		prevSlug: z.string().default(""),
		nextTitle: z.string().default(""),
		nextSlug: z.string().default(""),
	}),
});
const specCollection = defineCollection({
	schema: z.object({}),
});
export const collections = {
	posts: postsCollection,
	spec: specCollection,
};
