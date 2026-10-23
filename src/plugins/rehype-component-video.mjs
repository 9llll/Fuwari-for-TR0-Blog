/**
 * Markdown 指令 ::video{...} → 视频播放器
 *
 * 用法：
 *   ::video{src="https://www.youtube.com/embed/xxxx" title="演示视频"}
 *   ::video{platform="bilibili" bvid="BV1fK4y1s7Qf" title="B站视频"}
 *   ::video{platform="youtube" id="5gIf0_xpFPI" title="YouTube 视频"}
 *   ::video{src="/videos/demo.mp4" title="本地视频" poster="/images/cover.avif"}
 *
 * 参数：
 *   src      视频地址：本地路径 / 远程 mp4 / 第三方嵌入地址
 *   platform 平台：youtube / bilibili（配合 id 或 bvid 使用，可省略 src）
 *   id       平台视频 ID（YouTube 用）
 *   bvid     平台视频 ID（B 站用）
 *   title    视频标题，显示在播放器下方
 *   poster   本地视频的封面图
 *   ratio    宽高比，默认 16/9（可写 4/3、1/1 等）
 *   autoplay 传 true 则自动播放（仅本地视频可靠）
 *   loop     传 true 则循环播放
 *   muted    传 true 则静音播放
 *
 * 关键实现：外层容器固定宽高比（aspect-ratio），内层用绝对定位铺满。
 * 这样窄屏下高度会跟着宽度等比缩放，不会出现「宽度被压扁、高度仍是固定值」
 * 而导致的播放器变形。
 */
import { h } from "hastscript";
import {
	videoCaption,
	videoFill,
	videoMedia,
	videoWrapper,
} from "../utils/embed-styles.ts";

/** 常见视频文件扩展名，用于区分「本地/远程视频文件」与「第三方嵌入页」 */
const VIDEO_EXT = /\.(mp4|webm|ogg|ogv|mov|m4v|flv)(\?.*)?$/i;

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
 * 规范化宽高比，只接受 `数字/数字` 形式，避免注入非法 CSS。
 */
function normalizeRatio(raw) {
	const s = raw.trim();
	if (!s) return "16 / 9";
	const m = s.match(/^(\d{1,3})\s*\/\s*(\d{1,3})$/);
	if (!m) return "16 / 9";
	const w = Number(m[1]);
	const hgt = Number(m[2]);
	if (!w || !hgt) return "16 / 9";
	return `${w} / ${hgt}`;
}

/** 平台视频 ID 拼装成嵌入地址 */
function platformSrc(platform, id, bvid, autoplay) {
	if (platform === "youtube") {
		const params = new URLSearchParams();
		if (autoplay) params.set("autoplay", "1");
		const query = params.toString();
		return `https://www.youtube.com/embed/${id}${query ? `?${query}` : ""}`;
	}
	if (platform === "bilibili") {
		const params = new URLSearchParams();
		params.set("bvid", bvid);
		params.set("page", "1");
		if (autoplay) params.set("autoplay", "1");
		return `https://player.bilibili.com/player.html?${params.toString()}`;
	}
	return "";
}

export function VideoComponent(props, children) {
	if (Array.isArray(children) && children.length !== 0) {
		return usageHint(
			'"video" directive must be leaf type ::video{src="..." title="..."}',
		);
	}

	const p = props ?? {};
	const platform = asString(p.platform).trim().toLowerCase();
	const id = asString(p.id).trim();
	const bvid = asString(p.bvid).trim();
	const src = asString(p.src).trim();
	const title = asString(p.title).trim();
	const poster = asString(p.poster).trim();
	const ratio = normalizeRatio(asString(p.ratio));
	const autoplay = asBool(p.autoplay);
	const loop = asBool(p.loop);
	const muted = asBool(p.muted);

	// 1) 平台模式：platform + (id | bvid)
	let embedSrc = "";
	if (platform) {
		if (platform !== "youtube" && platform !== "bilibili") {
			return usageHint(
				`unsupported platform "${platform}", expected "youtube" or "bilibili"`,
			);
		}
		const vid = platform === "youtube" ? id : bvid || id;
		if (!vid) {
			return usageHint(
				`"${platform}" platform requires "${platform === "youtube" ? "id" : "bvid"}"`,
			);
		}
		embedSrc = platformSrc(platform, vid, vid, autoplay);
	} else if (src) {
		// 2) 直接给 src：视频文件 → <video>；其余视为第三方嵌入页 → <iframe>
		if (VIDEO_EXT.test(src)) {
			// 走 <video> 分支
		} else {
			embedSrc = src;
		}
	} else {
		return usageHint('"src" or "platform" is required');
	}

	const wrapperStyle = `aspect-ratio: ${ratio};`;

	// 本地/远程视频文件
	if (!embedSrc && src) {
		const videoAttrs = {
			class: videoMedia,
			controls: true,
			playsinline: true,
		};
		if (poster) videoAttrs.poster = poster;
		if (autoplay) videoAttrs.autoplay = true;
		if (loop) videoAttrs.loop = true;
		if (muted) videoAttrs.muted = true;
		if (autoplay && muted) videoAttrs.autoplay = true;

		const mime = src.match(VIDEO_EXT)?.[1]?.toLowerCase();
		const typeMap = {
			mp4: "video/mp4",
			m4v: "video/mp4",
			mov: "video/quicktime",
			webm: "video/webm",
			ogg: "video/ogg",
			ogv: "video/ogg",
			flv: "video/x-flv",
		};

		return h("div", { class: videoWrapper, style: wrapperStyle }, [
			h("video", videoAttrs, [
				h("source", {
					src,
					type: mime ? typeMap[mime] : undefined,
				}),
			]),
			title ? h("div", { class: videoCaption }, [title]) : null,
		]);
	}

	// 第三方嵌入页（iframe）
	return h("div", { class: videoWrapper, style: wrapperStyle }, [
		h("iframe", {
			class: videoFill,
			src: embedSrc,
			title: title || "video player",
			frameborder: "0",
			allow:
				"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
			allowfullscreen: true,
			loading: "lazy",
		}),
		title ? h("div", { class: videoCaption }, [title]) : null,
	]);
}
