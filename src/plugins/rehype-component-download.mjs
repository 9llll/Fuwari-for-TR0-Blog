import { h } from "hastscript";
import I18nKey from "../i18n/i18nKey.ts";
import { i18n } from "../i18n/translation.ts";
import {
	dlActions,
	dlBadge,
	dlCodeBtn,
	dlDesc,
	dlDownloadBtn,
	dlInfo,
	dlLock,
	dlMeta,
	dlName,
	dlRow,
	dlSize,
} from "../utils/download-styles.ts";
import {
	encodeDownloadUrl,
	hashDownloadPassword,
} from "../utils/download-utils.ts";

/** 内联 SVG 图标（hast 环境无法使用 astro-icon，这里用轻量路径集） */
const ICON_PATHS = {
	download: "M12 3v10.2l3.6-3.6L17 11l-5 5-5-5 1.4-1.4 3.6 3.6V3zM5 19h14v2H5z",
	lock: "M12 2a4 4 0 0 1 4 4v2h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h1V6a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v2h4V6a2 2 0 0 0-2-2z",
	zip: "M14 2H6v20h12V6zm-2 5l3 3-3 3-3-3zm-2 8h2v2h-2zm0 4h2v2h-2z",
	file: "M14 2H6v20h12V6zm-1 6V3.5L18.5 9z",
	image:
		"M21 3H3v18h18zm-2 16H5v-4.6l4-4 3 3 3.5-3.5L19 13zM8.5 8a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z",
	arrow: "M13 5l7 7-7 7v-4.5H4v-5h9V5z",
	key: "M12 2a5 5 0 0 1 4.6 3h-2.2A2.8 2.8 0 1 0 12 5c.6 0 1.2.2 1.7.5l-2 2H9.6l-1 1H7v1.6l-1.6 1.6H3v-3.5l6.3-6.3A5 5 0 0 1 12 2z",
};

/** 把 icon 字段映射为内置图标 */
function resolveIcon(icon) {
	if (!icon) return "download";
	const name = icon.toLowerCase();
	if (name.includes("zip") || name.includes("rar") || name.includes("archive"))
		return "zip";
	if (
		name.includes("image") ||
		name.includes("photo") ||
		name.includes("picture")
	)
		return "image";
	if (name.includes("lock")) return "lock";
	if (name.includes("key")) return "key";
	if (name.includes("file") || name.includes("doc")) return "file";
	return "download";
}

function svgIcon(name, size = 20) {
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

/**
 * 规范化指令属性：过滤非法数据并计算密码哈希。
 *
 * url 为空或不是 http(s)/相对路径时返回 null（防止 javascript: 之类的注入）。
 *
 * 属性名兼容两套写法（合并自 Fuwari 原有组件与 Firefly 下载按钮）：
 *   - 资源名：title（Fuwari 原有）或 name
 *   - 简介：desc 或 source（Fuwari 原有）
 *   - 另支持：size（大小）/ code（网盘提取码）/ hint（密码提示）
 *             / password（访问密码）/ icon（图标类型）
 */
function normalizeItem(props) {
	const url = asString(props.url).trim();
	if (!url) return null;

	const isSafeUrl =
		/^https?:\/\//i.test(url) ||
		url.startsWith("/") ||
		url.startsWith("./") ||
		url.startsWith("../");
	if (!isSafeUrl) return null;

	const password = asString(props.password).trim();
	const desc = asString(props.desc).trim();
	const source = asString(props.source).trim();
	const size = asString(props.size).trim();
	const code = asString(props.code).trim();
	const hint = asString(props.hint).trim();
	const icon = asString(props.icon).trim();
	const name =
		asString(props.name).trim() ||
		asString(props.title).trim() ||
		asString(props.source).trim() ||
		i18n(I18nKey.downloadAction);

	return {
		name,
		url,
		desc: desc || source,
		size,
		code,
		hint,
		icon,
		hash: password ? hashDownloadPassword(password) : "",
	};
}

/**
 * Markdown 指令 ::download{...} → 下载按钮
 *
 * 用法：
 *   ::download{title="示例包" url="/downloads/demo.zip" size="12.4 MB" password="1234"}
 *
 * 密码在构建期转为 SHA-256 哈希，明文不会出现在任何输出文件中。
 * 交互由 DownloadSupport.astro 的全局事件委托处理。
 */
export function DownloadComponent(props, children) {
	if (Array.isArray(children) && children.length !== 0) {
		return usageHint(
			'"download" directive must be leaf type ::download{title="..." url="..."}',
		);
	}

	const item = normalizeItem(props ?? {});
	if (!item) {
		return usageHint(
			'"url" is required and must be an http(s) or relative path',
		);
	}

	const uuid = `DL${Math.random().toString(36).slice(-6)}`;

	return h(`div#${uuid}`, { class: "not-prose my-4" }, [
		h("div", { class: dlRow }, [
			h("span", { class: dlBadge }, [svgIcon(resolveIcon(item.icon), 24)]),
			h("div", { class: dlInfo }, [
				h("div", { class: dlName }, [
					h("span", { class: "truncate" }, [item.name]),
				]),
				item.desc || item.size || item.hash
					? h("div", { class: dlMeta }, [
							item.hash
								? h("span", { class: dlLock }, [
										svgIcon("lock", 12),
										i18n(I18nKey.downloadLocked),
									])
								: null,
							item.desc ? h("span", { class: dlDesc }, [item.desc]) : null,
							item.desc && item.size ? h("span", {}, ["·"]) : null,
							item.size ? h("span", { class: dlSize }, [item.size]) : null,
						])
					: null,
			]),
			h("div", { class: dlActions }, [
				item.code
					? h(
							"button",
							{
								type: "button",
								class: dlCodeBtn,
								"data-dl-code": item.code,
								"data-dl-code-copied": i18n(I18nKey.downloadCodeCopied),
								title: `${i18n(I18nKey.downloadCode)}: ${item.code}`,
							},
							[
								svgIcon("key", 16),
								h("span", { "data-dl-code-text": true }, [
									i18n(I18nKey.downloadCodeCopyHint).replace(
										"{code}",
										item.code,
									),
								]),
							],
						)
					: null,
				h(
					"button",
					{
						id: `dl-btn-md-${uuid}`,
						type: "button",
						class: dlDownloadBtn,
						"data-dl-url": encodeDownloadUrl(item.url),
						"data-dl-name": item.name,
						"data-dl-hash": item.hash,
						"data-dl-hint": item.hint ?? "",
						"data-dl-title": i18n(I18nKey.downloadUnlockTitle),
						"data-dl-desc": i18n(I18nKey.downloadUnlockDesc),
						"data-dl-placeholder": i18n(I18nKey.passwordPlaceholder),
						"data-dl-submit": i18n(I18nKey.downloadUnlockSubmit),
						"data-dl-cancel": i18n(I18nKey.downloadCancel),
						"data-dl-error": i18n(I18nKey.downloadUnlockError),
						"data-dl-hint-label": i18n(I18nKey.passwordHint),
					},
					[
						svgIcon("download", 16),
						h("span", {}, [i18n(I18nKey.downloadAction)]),
						svgIcon("arrow", 16),
					],
				),
			]),
		]),
	]);
}
