import { h } from "hastscript";
import { visit } from "unist-util-visit";

/**
 * 富文本编辑器（Pages CMS / Typora 等）会自动把裸 URL 转成 Markdown 链接，
 * 写在指令属性里就会变成这样：
 *
 *   ::download{url="https://pan.baidu.com/s/xxx"}
 *   → ::download{url="[https://pan.baidu.com/s/xxx](https://pan.baidu.com/s/xxx)"}
 *
 * 属性值被塞进链接语法后，指令解析出来的 url 就是一串垃圾，
 * 下载按钮 / 视频 / 图片全部失效。
 *
 * 这里在解析阶段把被包裹过的属性值还原：
 *   - URL 类属性（url / href / src ...）→ 取链接地址
 *   - 文本类属性（desc / name / title ...）→ 取链接文字
 *   - 尖括号自动链接 <https://a.com> → 取里面的地址
 */
const MARKDOWN_LINK = /\[([^\][]*)\]\(([^()\s]+)(?:\s+"[^"]*")?\)/g;
const AUTO_LINK = /<((?:https?:\/\/|mailto:)[^>\s]+)>/g;

/** 这些属性的值本身是地址，应该取链接目标 */
const URL_ATTRS = new Set([
	"url",
	"href",
	"src",
	"poster",
	"image",
	"link",
	"action",
	"repo",
	"id",
]);

/** 还原单个属性值 */
function unmangleValue(name, value) {
	if (typeof value !== "string") return value;
	if (!value.includes("](") && !value.includes("<http")) return value;

	const isUrlAttr = URL_ATTRS.has(name.toLowerCase());

	return value
		.replace(MARKDOWN_LINK, (_match, text, target) => {
			const t = text.trim();
			const u = target.trim();
			// 文字与地址一致（编辑器把裸 URL 包成了链接）→ 只保留地址
			if (t === "" || t === u) return u;
			// 文字与地址不同：地址类属性取地址，文本类属性取文字
			return isUrlAttr ? u : t;
		})
		.replace(AUTO_LINK, (_match, url) => url);
}

/** 还原指令的全部属性 */
function unmangleAttributes(attributes) {
	const result = {};
	for (const [name, value] of Object.entries(attributes)) {
		result[name] = unmangleValue(name, value);
	}
	return result;
}

export function parseDirectiveNode() {
	return (tree, { _data }) => {
		visit(tree, (node) => {
			if (
				node.type === "containerDirective" ||
				node.type === "leafDirective" ||
				node.type === "textDirective"
			) {
				// biome-ignore lint/suspicious/noAssignInExpressions: <check later>
				const data = node.data || (node.data = {});
				node.attributes = node.attributes || {};
				if (
					node.children.length > 0 &&
					node.children[0].data &&
					node.children[0].data.directiveLabel
				) {
					// Add a flag to the node to indicate that it has a directive label
					node.attributes["has-directive-label"] = true;
				}
				// 还原被编辑器自动链接化的属性值
				node.attributes = unmangleAttributes(node.attributes);
				const hast = h(node.name, node.attributes);

				data.hName = hast.tagName;
				data.hProperties = hast.properties;
			}
		});
	};
}
