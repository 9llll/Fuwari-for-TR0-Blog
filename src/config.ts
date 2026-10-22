import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "羡鱼资源",
	keywords: "羡鱼资源,资源分享,资源网,PC 软件,PC 软件下载,安卓应用,安卓 APP, 实用 APP, 源码,源码分享,开源源码,优质资源,免费资源,无广告资源,绿色软件,手机应用,精品资源,资源合集,资源平台,软件下载,应用推荐,源码下载,雾创岛资源,综合资源网,技术教程,EdgeOne 教程,EdgeOne 配置,Cloudflare 教程,Cloudflare 设置,CDN 技术教程,EdgeOne 使用指南,Cloudflare 优化教程,网络技术教程,服务器技术教程,站长技术资讯,网站技术教程,建站技术分享,服务器运维教程,网站搭建教程,站长工具资源,网站优化技术,服务器配置教程,网站安全技术,站长资源分享,网站源码教程,CDN 站长工具,EdgeOne 站长指南,Cloudflare 站长教程",
	description: "羡鱼资源专注于优质资源聚合的分享平台，涵盖 PC 软件、安卓应用、实用 APP、各类源码及多领域精品资源，致力于通过精选内容与流畅体验，打造国内用户体验一流的综合性资源分享网站。",
	lang: "zh_CN", // Language code, e.g. 'en', 'zh_CN', 'ja', etc.
	themeColor: {
		hue: 250, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
		fixed: true, // Hide the theme color picker for visitors
	},
	banner: {
		enable: true,
		src: "assets/images/banner.webp", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
		position: "center", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
		credit: {
			enable: false, // Display the credit text of the banner image
			text: "", // Credit text to be displayed
			url: "", // (Optional) URL link to the original artwork or artist's page
		},
	},
	toc: {
		enable: true, // Display the table of contents on the right side of the post
		depth: 2, // Maximum heading depth to show in the table, from 1 to 3
	},
	favicon: [
		// Leave this array empty to use the default favicon
		{
			src: "/favicon.ico", // Path of the favicon, relative to the /public directory
			theme: "light", // (Optional) Either 'light' or 'dark', set only if you have different favicons for light and dark mode
			sizes: "32x32", // (Optional) Size of the favicon, set only if you have favicons of different sizes
		},
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.About,
		{
			name: "友情链接",
			url: "/friends/",
			external: false,
		}
	],
};

export const profileConfig: ProfileConfig = {
	title: "羡鱼资源",
	avatar: "assets/images/avatar.png", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
	name: "羡鱼",
	bio: "夫唯不争\n故天下莫能与之争。",
	links: [
		{
			name: "Home",
			icon: "fa6-brands:chrome",
			url: "https://www.moci.cc",
		},
		{
			name: "QQ",
			icon: "fa6-brands:qq",
			url: "https://pd.qq.com/qqweb/qunpro/share?_wv=3&_wwv=128&appChannel=share&attaContentID=2c2b39108a3646c2b5da95b49c9928b9&biz=ka&businessType=9&from=246610&inviteCode=2DJ40Bau83b&mainSourceId=share&subSourceId=others&b=9",
		},
		{
			name: "BiliBili",
			icon: "fa6-brands:bilibili",
			url: "https://space.bilibili.com/3690991479425287",
		},
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/9llll",
		},
	],
	icp: "陕ICP备2025081382号"
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// Note: Some styles (such as background color) are being overridden, see the astro.config.mjs file.
	// Please select a dark theme, as this blog theme currently only supports dark background color
	theme: "github-dark",
};

export const friends = [
	{
		name: "大佬论坛",
		url: "https://www.dalao.net",
		avatar: "https://img.alicdn.com/imgextra/i3/1658666455/O1CN01LM00xt1SYbJ0G71c_!!1658666455.png",
		description: "中文站长论坛，中国域名玩家论坛，专注域名投资、域名收藏交流，实时更新域名行情动态；同时打造互联网综合交流、生活分享平台，汇聚各路资源福利，兼顾站长交流、服务器技术与日常分享，是域名爱好者、投资者与站长的一站式交流社区。"
	}
]
