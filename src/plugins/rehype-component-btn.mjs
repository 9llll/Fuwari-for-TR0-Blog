/**
 * Markdown 指令 ::btn{...} → 链接按钮
 *
 * 用法：
 *   ::btn{href="https://example.com" text="立即下载"}
 *   ::btn{href="/downloads/demo.zip" text="本地文件" variant="secondary" icon="download"}
 *
 * 参数：
 *   href     必填，链接地址（http/https 或站内相对路径）
 *   text     必填，按钮文字（也兼容 title / label）
 *   variant  按钮样式：primary（默认）/ secondary / outline / ghost
 *   icon     可选，图标名（download / external / arrow / play / link / check / info / star）
 *   target   链接打开方式：self（默认）/ blank
 *   block    传 true 则按钮独占一行（width: 100%）
 *
 * 样式集中定义在 src/utils/embed-styles.ts，站点主题色变更时自动跟随。
 */
import { h } from "hastscript";
import {
	btnBase,
	btnGhost,
	btnOutline,
	btnPrimary,
	btnSecondary,
} from "../utils/embed-styles.ts";

/** 内联 SVG 图标（hast 环境无法使用 astro-icon，这里用轻量路径集） */
const ICON_PATHS = {
	download: "M12 3v10.2l3.6-3.6L17 11l-5 5-5-5 1.4-1.4 3.6 3.6V3zM5 19h14v2H5z",
	external:
		"M14 3v2h3.6l-9.8 9.8 1.4 1.4L19 6.4V10h2V3h-7zM5 5h5V3H3v18h18v-7h-2v5H5V5z",
	arrow: "M13 5l7 7-7 7v-4.5H5v-3h8V5z",
	play: "M8 5v14l11-7L8 5z",
	link: "M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7a5 5 0 0 0 0 10h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4a5 5 0 0 0 0-10z",
	check: "M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z",
	info: "M11 7h2V9h-2V7zm0 4h2v6h-2v-6zm1-9a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z",
	star: "M12 17.3 6.2 20.8l1.6-7L2 9.2l7.1-.6L12 2l2.9 6.6 7.1.6-5.8 4.6 1.6 7L12 17.3z",
};

/** 把 icon 属性映射为内置图标 */
function resolveIcon(icon) {
	if (!icon) return "";
	const name = icon.toLowerCase();
	if (name.includes("download")) return "download";
	if (name.includes("external") || name.includes("blank")) return "external";
	if (name.includes("arrow")) return "arrow";
	if (name.includes("play") || name.includes("video")) return "play";
	if (name.includes("check") || name.includes("done")) return "check";
	if (name.includes("info") || name.includes("help")) return "info";
	if (name.includes("star")) return "star";
	return "link";
}

function svgIcon(name, size = 18) {
	return h(
		"svg",
		{
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 24 24",
			width: String(size),
			height: String(size),
			fill: "currentColor",
			"aria-hidden": "true",
			style: "flex-shrink:0;display:block",
		},
		[h("path", { d: ICON_PATHS[name] })],
	);
}

/** 配置错误提示（插入正文方便排查） */
function usageHint(message) {
	return h("div", { class: "hidden" }, [`Invalid directive. (${message})`]);
}

/** 统一把属性值转为字符串 */
function asString(value) {
	if (value === undefined || value === null) return "";
	if (typeof value === "string") return value;
	if (typeof value === "number" || typeof value === "boolean") {
		return String(value);
	}
	return "";
}

/** 布尔属性：存在且非 "false"/"0" 即为真 */
function asBool(value) {
	const s = asString(value).trim().toLowerCase();
	return s !== "" && s !== "false" && s !== "0" && s !== "no";
}

/**
 * 规范化指令属性。
 *
 * url 为空或不是 http(s)/相对路径时返回 null（防止 javascript: 之类的注入）。
 */
function normalizeBtn(props) {
	const href = asString(props.href).trim();
	if (!href) return null;

	const isSafeUrl =
		/^https?:\/\//i.test(href) ||
		href.startsWith("/") ||
		href.startsWith("./") ||
		href.startsWith("../");
	if (!isSafeUrl) return null;

	const text =
		asString(props.text).trim() ||
		asString(props.title).trim() ||
		asString(props.label).trim();
	if (!text) return null;

	const variantKey = asString(props.variant).trim().toLowerCase() || "primary";
	const variantClass =
		{
			primary: btnPrimary,
			secondary: btnSecondary,
			outline: btnOutline,
			ghost: btnGhost,
		}[variantKey] ?? btnPrimary;

	const icon = asString(props.icon).trim();
	const target =
		asString(props.target).trim().toLowerCase() === "blank" ? "_blank" : null;

	return {
		href,
		text,
		variantClass,
		icon: icon ? resolveIcon(icon) : "",
		target,
		rel: target === "_blank" ? "noopener noreferrer" : null,
		block: asBool(props.block),
	};
}

export function BtnComponent(props, children) {
	if (Array.isArray(children) && children.length !== 0) {
		return usageHint(
			'"btn" directive must be leaf type ::btn{href="..." text="..."}',
		);
	}

	const item = normalizeBtn(props ?? {});
	if (!item) {
		return usageHint(
			'"href" and "text" are required, and "href" must be an http(s) or relative path',
		);
	}

	const classes = [
		"dl-btn",
		// no-styling：跳过 .custom-md a:not(.no-styling) 这条全局链接规则。
		// 它会把 color 强制成主色、加虚线下划线、并把 display 改成 inline-block，
		// 三者都会破坏按钮外观（主色实心按钮的文字会与背景同色而看不见）。
		"no-styling",
		btnBase,
		item.variantClass,
		item.block ? "w-full max-[560px]:w-full" : "",
	]
		.filter(Boolean)
		.join(" ");

	return h(
		"a",
		{
			href: item.href,
			class: classes,
			target: item.target,
			rel: item.rel,
		},
		[item.icon ? svgIcon(item.icon) : null, h("span", {}, [item.text])],
	);
}
