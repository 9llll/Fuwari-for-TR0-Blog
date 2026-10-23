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

/**
 * 日期字段容错解析。
 *
 * Pages CMS 等外部编辑器写入的日期可能是带引号的字符串
 * （如 published: "2026-10-23"），若 schema 严格只接受 Date，
 * Astro 同步内容时会抛错并中断整个构建。这里统一把字符串转成 Date。
 */
const dateSchema = z.preprocess((val: unknown): unknown => {
	if (val instanceof Date) return val;
	if (typeof val === "string" && val.trim()) {
		const d = new Date(val);
		return Number.isNaN(d.getTime()) ? val : d;
	}
	return val;
}, z.date());

const postsCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		published: dateSchema,
		updated: dateSchema.optional(),
		draft: z.boolean().optional().default(false),
		description: z.string().optional().default(""),
		image: z.string().optional().default(""),
		tags: z.array(z.string()).optional().default([]),
		category: categorySchema,

		/** SEO：关键词，逗号分隔或数组 */
		keywords: z
			.preprocess((val: unknown): string[] => {
				if (val === undefined || val === null) return [];
				if (Array.isArray(val)) return val.map(String).filter(Boolean);
				return String(val)
					.split(/[,，]/)
					.map((s) => s.trim())
					.filter(Boolean);
			}, z.array(z.string()))
			.optional()
			.default([]),

		/** 作者（默认用站点全局作者，可单篇覆盖） */
		author: z.string().optional().default(""),

		/** 系列文章名称；留空表示不属于任何系列 */
		series: z.string().optional().default(""),

		/** 同系列内的排序序号，越小越靠前 */
		seriesOrder: z.number().optional().default(0),

		/** 社交分享图（OG Image），建议填完整 http(s) 链接 */
		ogImage: z.string().optional().default(""),

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
