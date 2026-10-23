import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	NavBarLink,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";
import friendsData from "./data/friends.json";
import navData from "./data/nav.json";
import profileData from "./data/profile.json";
import siteData from "./data/site.json";

/**
 * 站点配置的数据源
 *
 * 配置内容放在 `src/data/*.json`，由 Pages CMS 在线编辑（见根目录 `.pages.yml`），
 * 修改后提交到仓库，CI 自动重新构建。
 *
 * 这里保留一份内置默认值：CMS 里把某项清空时自动回退到默认值，
 * 避免一次误操作（清空站名 / 删掉 banner）直接把站点改崩。
 */

/** 取非空字符串 */
function str(value: unknown, fallback: string): string {
	return typeof value === "string" && value.trim() !== "" ? value : fallback;
}

/** 取布尔值 */
function bool(value: unknown, fallback: boolean): boolean {
	return typeof value === "boolean" ? value : fallback;
}

/** 取数字 */
function num(value: unknown, fallback: number): number {
	return typeof value === "number" && !Number.isNaN(value) ? value : fallback;
}

/* ---------------------------------------------------------------- 站点信息 */

const siteDefaults: SiteConfig = {
	title: "羡鱼资源",
	keywords: "",
	description: "",
	lang: "zh_CN",
	themeColor: { hue: 250, fixed: true },
	banner: {
		enable: true,
		src: "assets/images/banner.webp",
		position: "center",
		credit: { enable: false, text: "", url: "" },
	},
	toc: { enable: true, depth: 2 },
	favicon: [{ src: "/favicon.ico", theme: "light", sizes: "32x32" }],
};

const site = siteData as Record<string, any>;
const bannerData = (site.banner ?? {}) as Record<string, any>;
const creditData = (bannerData.credit ?? {}) as Record<string, any>;
const themeData = (site.themeColor ?? {}) as Record<string, any>;
const tocData = (site.toc ?? {}) as Record<string, any>;

export const siteConfig: SiteConfig = {
	title: str(site.title, siteDefaults.title),
	keywords: str(site.keywords, siteDefaults.keywords),
	description: str(site.description, siteDefaults.description),
	lang: str(site.lang, siteDefaults.lang) as SiteConfig["lang"],
	themeColor: {
		hue: num(themeData.hue, siteDefaults.themeColor.hue),
		fixed: bool(themeData.fixed, siteDefaults.themeColor.fixed),
	},
	banner: {
		enable: bool(bannerData.enable, siteDefaults.banner.enable),
		src: str(bannerData.src, siteDefaults.banner.src),
		position: (str(
			bannerData.position,
			siteDefaults.banner.position as string,
		) as SiteConfig["banner"]["position"]),
		credit: {
			enable: bool(creditData.enable, siteDefaults.banner.credit.enable),
			text: str(creditData.text, siteDefaults.banner.credit.text),
			url: str(creditData.url, siteDefaults.banner.credit.url ?? ""),
		},
	},
	toc: {
		enable: bool(tocData.enable, siteDefaults.toc.enable),
		depth: num(tocData.depth, siteDefaults.toc.depth) as SiteConfig["toc"]["depth"],
	},
	favicon:
		Array.isArray(site.favicon) && site.favicon.length > 0
			? site.favicon
			: siteDefaults.favicon,
};

/* ---------------------------------------------------------------- 导航栏 */

/**
 * 把 CMS 里填的导航项还原成 NavBarLink。
 * 三个内置页面（首页 / 归档 / 关于）仍走 LinkPreset，
 * 以保留多语言文案（写死中文会导致切换语言时导航不跟随）。
 */
function toNavLink(item: Record<string, any>): NavBarLink | LinkPreset {
	const url = str(item.url, "").replace(/\/+$/, "") || "/";
	if (url === "/") return LinkPreset.Home;
	if (url === "/about") return LinkPreset.About;
	if (url === "/archive") return LinkPreset.Archive;
	return {
		name: str(item.name, "链接"),
		url: str(item.url, "/"),
		external: bool(item.external, false),
	};
}

export const navBarConfig: NavBarConfig = {
	links:
		Array.isArray(navData) && navData.length > 0
			? navData.map((item) => toNavLink(item as Record<string, any>))
			: [LinkPreset.Home, LinkPreset.Archive, LinkPreset.About],
};

/* ---------------------------------------------------------------- 侧边栏资料 */

const profile = profileData as Record<string, any>;

export const profileConfig: ProfileConfig = {
	title: str(profile.title, "羡鱼资源"),
	avatar: str(profile.avatar, "assets/images/avatar.png"),
	name: str(profile.name, "羡鱼"),
	bio: str(profile.bio, ""),
	links: Array.isArray(profile.links)
		? profile.links.map((link: Record<string, any>) => ({
				name: str(link.name, "链接"),
				icon: str(link.icon, ""),
				url: str(link.url, "#"),
			}))
		: [],
	icp: str(profile.icp, ""),
};

/* ---------------------------------------------------------------- 许可证 */

const license = (site.license ?? {}) as Record<string, any>;

export const licenseConfig: LicenseConfig = {
	enable: bool(license.enable, true),
	name: str(license.name, "CC BY-NC-SA 4.0"),
	url: str(license.url, "https://creativecommons.org/licenses/by-nc-sa/4.0/"),
};

/* ---------------------------------------------------------------- 代码块主题 */

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// Note: Some styles (such as background color) are being overridden, see the astro.config.mjs file.
	// Please select a dark theme, as this blog theme currently only supports dark background color
	theme: str(site.codeTheme, "github-dark") as ExpressiveCodeConfig["theme"],
};

/* ---------------------------------------------------------------- 友情链接 */

export const friends =
	Array.isArray(friendsData) && friendsData.length > 0
		? friendsData.map((friend: Record<string, any>) => ({
				name: str(friend.name, ""),
				url: str(friend.url, "#"),
				avatar: str(friend.avatar, ""),
				description: str(friend.description, ""),
			}))
		: [];
