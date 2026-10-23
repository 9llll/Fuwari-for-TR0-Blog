/**
 * Markdown 指令 ::gallery → 图片网格（点击放大）
 *
 * 用法：把若干 `![](图片)` 放在指令块里即可。
 *   ::gallery
 *   ![说明1](images/a.avif)
 *   ![说明2](images/b.avif)
 *   ::
 *
 * 渲染为一个 grid 容器。站内图片会被 PhotoSwipe 自动接管点击放大，
 * 因此这里只负责布局，不需要额外的客户端脚本。
 */
import { h } from "hastscript";
import { galleryGrid } from "../utils/embed-styles.ts";

/** 过滤掉空白文本节点，只保留真正的图片等元素 */
function cleanChildren(children) {
	if (!Array.isArray(children)) return [];
	return children.filter((node) => {
		if (!node) return false;
		if (node.type === "text") return node.value.trim() !== "";
		return true;
	});
}

export function GalleryComponent(props, children) {
	const items = cleanChildren(children);
	if (items.length === 0) {
		return h("div", { class: "hidden" });
	}

	// 让相邻两张图高度一致：用 aspect-ratio 兜底，避免网格错位
	return h("div", { class: galleryGrid }, items);
}
