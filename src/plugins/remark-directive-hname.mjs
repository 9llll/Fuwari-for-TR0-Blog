/**
 * 为部分指令换一个不与 HTML 标签冲突的 hName
 *
 * 背景：rehype-components 按标签名映射组件，并且会在替换节点后继续遍历
 * 新插入的内容。如果某个指令渲染出的 HTML 里含有与指令同名的标签
 * （例如 ::video 渲染出 <video>），该元素会被再次送进同一个组件，
 * 轻则渲染出错，重则无限递归导致构建卡死。
 *
 * 解决：在 remark 阶段把这类指令的 hName 改成带前缀的自定义名，
 * 注册组件时用新名字，内层真实标签（<video> / <a>）就不再被匹配到。
 *
 * 必须在 parseDirectiveNode 之后执行——它会把 hName 覆盖成指令原名。
 */
import { visit } from "unist-util-visit";

/** 需要改名的指令 → 新 hName */
const RENAMED = {
	video: "video-embed",
	btn: "btn-link",
};

export function remarkDirectiveHName() {
	return (tree) => {
		visit(tree, (node) => {
			if (
				node.type !== "containerDirective" &&
				node.type !== "leafDirective" &&
				node.type !== "textDirective"
			) {
				return;
			}
			const renamed = RENAMED[node.name];
			if (!renamed) return;
			if (!node.data) {
				node.data = {};
			}
			node.data.hName = renamed;
		});
	};
}
