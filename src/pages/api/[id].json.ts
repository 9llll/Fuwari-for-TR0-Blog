import { getImage } from "astro:assets";
import { getCollection } from "astro:content";
import type { APIRoute, ImageMetadata } from "astro";
import MarkdownIt from "markdown-it";
import { isApiCover, resolveCoverImage } from "../../utils/cover-image";

// 预加载 src/assets 下的图片，用于把 frontmatter 中的相对路径
// 解析成 Astro 构建后的 /_astro/xxx.webp 真实地址。
// 首页 PostCard 走 ImageWrapper 组件能正确解析，但本 API 端点需要自行解析。
const assetImages = import.meta.glob<ImageMetadata>("../../assets/**", {
	import: "default",
});

// 把 frontmatter 的 image 字段解析为可访问的 URL：
//   - 远程图片（http/https）：原样返回
//   - public/ 绝对路径（以 / 开头）：原样返回
//   - "api"：随机封面图 API（带 seed 参数，保证同一文章封面稳定）
//   - src/assets/... 相对路径：解析为 Astro 优化后的 /_astro/... 地址
async function resolveImageUrl(p: unknown, seed?: string): Promise<string> {
	const fallback = "/favicon/favicon-32x32.png";
	if (!p || typeof p !== "string") return fallback;
	const s = String(p).trim();
	if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/"))
		return s;

	// 随机封面图：解析为带 seed 的 API 地址
	if (isApiCover(s)) {
		return resolveCoverImage(s, seed) || fallback;
	}

	const filename = s
		.replace(/^\.?\//, "")
		.split("/")
		.pop();
	if (!filename) return fallback;

	// 在已加载资源中按文件名匹配（兼容 assets 下任意子目录）
	const directKey = `src/assets/images/${filename}`;
	const key =
		(directKey in assetImages && directKey) ||
		Object.keys(assetImages).find((k) => k.endsWith(`/${filename}`)) ||
		"";
	if (key) {
		try {
			const { src } = await getImage({ src: await assetImages[key]() });
			return src;
		} catch {
			return fallback;
		}
	}
	return fallback;
}

export const prerender = true;

export async function getStaticPaths() {
	try {
		const articles = await getCollection("posts");
		return articles.flatMap((article) => {
			const cleanId = article.id.replace(/\.md$/, "");
			return [{ params: { id: cleanId } }, { params: { id: `${cleanId}/` } }];
		});
	} catch (error) {
		console.error("getStaticPaths执行错误:", error);
		return [];
	}
}

export const GET: APIRoute = async ({ params }) => {
	try {
		const { id } = params;

		if (!id || typeof id !== "string" || id.trim() === "") {
			return new Response(
				JSON.stringify({ code: "400", message: "请提供有效的文章ID" }),
				{ status: 400, headers: { "Content-Type": "application/json" } },
			);
		}

		const cleanId = id.trim().replace(/\/$/, "");
		const articles = await getCollection("posts");
		const articleId = `${cleanId}.md`;
		const article = articles.find((item) => item.id === articleId);

		if (!article) {
			return new Response(
				JSON.stringify({
					code: "404",
					message: `文章ID不存在: ${cleanId}`,
				}),
				{ status: 404, headers: { "Content-Type": "application/json" } },
			);
		}

		// 处理图片路径：把 frontmatter 中的 src/assets/... 相对路径
		// 解析为 Astro 构建后的 /_astro/... 真实地址（否则图片 404 不显示）
		const a = article;
		const frontmatter = a.data;
		const imageUrlNormalized = await resolveImageUrl(frontmatter?.image, a.id);

		// 使用markdown-it渲染HTML
		const md = new MarkdownIt();
		const renderedHTML = md.render(a.body);

		return new Response(
			JSON.stringify({
				...frontmatter,
				image: imageUrlNormalized,
				body: renderedHTML,
				slug: a.slug,
				id: a.id,
				// 调试信息（仅开发环境）
				...(process.env.NODE_ENV === "development" && {
					debug: {
						originalPath: frontmatter?.image,
						processedPath: imageUrlNormalized,
						environment: process.env.NODE_ENV || "development",
					},
				}),
			}),
			{
				headers: {
					"Content-Type": "application/json",
					"Cache-Control": "public, max-age=60",
				},
			},
		);
	} catch (error) {
		console.error("请求处理错误:", error);
		return new Response(
			JSON.stringify({
				code: "500",
				message:
					process.env.NODE_ENV === "development"
						? error instanceof Error
							? error.message
							: "服务器错误"
						: "服务器内部错误",
			}),
			{ status: 500, headers: { "Content-Type": "application/json" } },
		);
	}
};
