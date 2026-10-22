import { visit } from "unist-util-visit";

/**
 * 自动识别文章角标类型
 *
 * 通过遍历 Markdown AST 中的 download 指令节点来判断，
 * 而非正则匹配原文——这样可以正确排除代码块里的示例写法
 * （例如 download-guide.md 里的 ```::download{...}``` 不会被误判）。
 *
 * 判定优先级：
 *   1. 文章内存在带 password 属性的下载指令 → 加密下载
 *   2. 文章内存在下载指令（无密码）        → 免费下载
 *   3. 两者都没有（教程、分享、随笔等）    → 教程文章
 *
 * 结果写入 data.astro.frontmatter.badgeType，供 PostCard / 文章页读取。
 */
export function remarkPostBadge() {
	return (tree, { data }) => {
		let hasDownload = false;
		let hasEncrypted = false;

		visit(tree, (node) => {
			if (
				node.type !== "leafDirective" &&
				node.type !== "textDirective" &&
				node.type !== "containerDirective"
			) {
				return;
			}
			if (node.name !== "download") return;

			hasDownload = true;
			// password 属性存在且非空即视为加密资源
			const pwd = node.attributes?.password;
			if (typeof pwd === "string" && pwd.trim() !== "") {
				hasEncrypted = true;
			}
		});

		const badgeType = hasEncrypted
			? "encrypted"
			: hasDownload
				? "free"
				: "tutorial";

		data.astro.frontmatter.badgeType = badgeType;
		data.astro.frontmatter.hasDownload = hasDownload;
		data.astro.frontmatter.hasEncrypted = hasEncrypted;
	};
}
