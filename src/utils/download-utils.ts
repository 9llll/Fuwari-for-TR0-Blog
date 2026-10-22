import { createHash } from "node:crypto";

/**
 * 下载按钮的构建期工具函数
 *
 * 与 rehype-component-download.mjs（正文 ::download 指令）共用。
 */

/**
 * 计算下载密码的 SHA-256 十六进制哈希。
 *
 * 前端提交密码后用 WebCrypto 计算同样的哈希再比对，
 * 明文密码不会出现在任何输出文件中。
 */
export function hashDownloadPassword(password: string): string {
	return createHash("sha256").update(password, "utf8").digest("hex");
}

/**
 * 把真实下载地址编码为 Base64，避免明文出现在 HTML 里。
 *
 * 混淆目的：查看源码 / F12 Elements 中搜不到真实地址。
 * 注意这只是混淆不是加密——点击下载的瞬间，Network 面板仍能看到真实请求。
 * 要彻底隐藏地址需服务端中转（如 Cloudflare Pages Function 代理）。
 */
export function encodeDownloadUrl(url: string): string {
	return Buffer.from(url, "utf8").toString("base64");
}
