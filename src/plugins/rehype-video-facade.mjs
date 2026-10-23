/**
 * Markdown 指令 ::video{...} → 点击播放面板（facade）
 *
 * 思路：构建期只输出「封面 + 播放按钮」的静态面板，不内联 iframe；
 * 用户点击后才由前端脚本注入真正的播放器并自动播放。
 * 好处：
 *   1. 不再提前加载 B 站 / YouTube 播放器，首屏更轻、不会一进来就弹登录/广告；
 *   2. 封面始终可见，播放按钮清晰可点，解决「看不到按钮」；
 *   3. 点击属于用户手势，autoplay 不再被浏览器拦截。
 *
 * 该插件是异步的，会在构建期抓取 B 站封面图；抓取失败时回退到渐变占位。
 */
import { h } from "hastscript";
import { visit } from "unist-util-visit";
import {
	videoCaption,
	videoFacade,
	videoFacadeBadge,
	videoFacadeBtn,
	videoFacadeCover,
	videoWrapper,
} from "../utils/embed-styles.ts";

const VIDEO_EXT = /\.(mp4|webm|ogg|ogv|mov|m4v|flv)(\?.*)?$/i;

function asString(value) {
	if (value === undefined || value === null) return "";
	if (typeof value === "string") return value;
	if (typeof value === "number" || typeof value === "boolean") return String(value);
	return "";
}

function normalizeRatio(raw) {
	const s = (raw ?? "").toString().trim();
	if (!s) return "16 / 9";
	const m = s.match(/^(\d{1,3})\s*\/\s*(\d{1,3})$/);
	if (!m) return "16 / 9";
	const w = Number(m[1]);
	const hgt = Number(m[2]);
	if (!w || !hgt) return "16 / 9";
	return `${w} / ${hgt}`;
}

/** 平台视频 ID 拼装成嵌入地址（不含 autoplay，autoplay 由前端点击时追加） */
function platformSrc(platform, vid) {
	if (platform === "youtube") {
		return `https://www.youtube.com/embed/${vid}`;
	}
	if (platform === "bilibili") {
		const params = new URLSearchParams();
		params.set("bvid", vid);
		params.set("page", "1");
		params.set("high_quality", "1");
		params.set("danmaku", "0");
		return `https://player.bilibili.com/player.html?${params.toString()}`;
	}
	return "";
}

/** 构建期抓取 B 站封面（api.bilibili.com 在 Node 环境可达） */
async function fetchBilibiliCover(bvid) {
	try {
		const ctrl = new AbortController();
		const timer = setTimeout(() => ctrl.abort(), 6000);
		const res = await fetch(
			`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`,
			{ signal: ctrl.signal, headers: { "User-Agent": "Mozilla/5.0" } },
		);
		clearTimeout(timer);
		if (!res.ok) return "";
		const json = await res.json();
		const pic = json?.data?.pic;
		return pic ? pic.replace(/^http:\/\//, "https://") : "";
	} catch {
		return "";
	}
}

export function rehypeVideoFacade() {
	return async (tree) => {
		const tasks = [];

		visit(tree, "element", (node) => {
			if (node.tagName !== "video-embed") return;

			const props = node.properties ?? {};
			const platform = asString(props.platform).trim().toLowerCase();
			const id = asString(props.id).trim();
			const bvid = asString(props.bvid).trim();
			const src = asString(props.src).trim();
			const title = asString(props.title).trim();
			const poster = asString(props.poster).trim();
			const ratio = normalizeRatio(props.ratio);
			const autoplay = asString(props.autoplay).trim().toLowerCase() === "true";

			let embedSrc = "";
			let provider = "";
			let type = "iframe"; // iframe | video

			if (platform === "youtube" || platform === "bilibili") {
				const vid = platform === "youtube" ? id : bvid || id;
				if (!vid) return;
				embedSrc = platformSrc(platform, vid);
				provider = platform === "youtube" ? "YouTube" : "B 站";
			} else if (src && VIDEO_EXT.test(src)) {
				embedSrc = src;
				type = "video";
				provider = "本地视频";
			} else if (src) {
				embedSrc = src;
				provider =
					src.includes("bilibili") ? "B 站" :
					src.includes("youtube") ? "YouTube" : "视频";
			} else {
				return;
			}

			// 记录一个异步任务：B 站封面抓取（仅当未显式给 poster 时）
			let coverPromise = Promise.resolve(poster);
			if (!poster && platform === "bilibili" && bvid) {
				coverPromise = fetchBilibiliCover(bvid);
			}

			tasks.push(async () => {
				const cover = await coverPromise;

				const children = [
					// 底层渐变，封面加载失败时仍美观
					h("div", {
						class:
							"absolute inset-0 bg-gradient-to-br from-[var(--primary-soft)] to-black/40",
					}),
				];

				if (cover) {
					children.push(
						h("img", {
							class: videoFacadeCover,
							src: cover,
							alt: title || "video cover",
							loading: "lazy",
							onerror: "this.style.display='none'",
						}),
					);
				}

				children.push(
					h(
						"button",
						{
							type: "button",
							class: videoFacadeBtn,
							"aria-label": "播放视频",
							"data-video-facade-play": "",
						},
						[
							h("span", {
								class:
									"ml-1 inline-block border-y-[10px] border-l-[16px] border-y-transparent border-l-white",
							}),
						],
					),
				);

				if (provider) {
					children.push(
						h("div", { class: videoFacadeBadge }, [provider]),
					);
				}

				const facade = h("div", {
					class: `${videoFacade} ${videoWrapper}`,
					style: `aspect-ratio: ${ratio};`,
					"data-embed-src": embedSrc,
					"data-embed-type": type,
					"data-poster": cover || poster || "",
					...(autoplay ? { "data-autoplay": "1" } : {}),
				}, children);

				const wrapper = [facade];
				if (title) {
					wrapper.push(h("div", { class: videoCaption }, [title]));
				}

				// 用父节点的子节点替换：直接就地替换当前节点
				Object.assign(node, {
					type: "element",
					tagName: "div",
					properties: { className: ["not-prose", "my-4", "w-full"] },
					children: wrapper,
				});
			});
		});

		await Promise.all(tasks.map((t) => t()));
	};
}
