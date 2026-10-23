/**
 * 文章封面图处理工具
 *
 * 约定（与 frontmatter 的 image 字段对应）：
 *   1. image 写具体图片地址（本地相对路径或远程 URL）→ 直接使用该图
 *   2. image 写 "api" → 显式使用随机封面图 API
 *   3. image 不写 / 为空 → 交由调用方使用渐变占位封面
 *
 * 随机封面图 API 会带上 seed 参数，保证同一篇文章每次访问拿到同一张图，
 * 不同文章则拿到不同的图。
 */

/** 随机封面图 API 列表（按顺序尝试，第一个可用即采用） */
export const randomCoverApis: string[] = [
	"https://api.suyanw.cn/api/comic3.php",
];

/** 判断 image 字段是否为「使用随机封面图」的占位值 */
export function isApiCover(image: string | undefined | null): boolean {
	return image === "api";
}

/**
 * 根据 seed 生成确定性 hash 值
 * （同一 seed 永远得到同一个 hash，保证封面图稳定）
 */
function getSeedHash(seed?: string): number {
	if (!seed) return 0;
	return Math.abs(
		seed.split("").reduce((acc, char) => {
			return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
		}, 0),
	);
}

/**
 * 为 API URL 添加 seed 参数，确保每篇文章获取不同的图片
 */
function appendSeedParam(apiUrl: string, hash: number): string {
	if (hash === 0) return apiUrl;
	const separator = apiUrl.includes("?") ? "&" : "?";
	return `${apiUrl}${separator}v=${hash}`;
}

/**
 * 解析文章封面图地址。
 *
 * - 显式图片地址（非 "api"、非空）→ 原样返回
 * - "api" → 返回第一个随机封面图 API 的 URL（带 seed 参数）
 * - 空值 → 返回空字符串，由调用方决定使用渐变占位封面
 */
export function resolveCoverImage(
	image: string | undefined | null,
	seed?: string,
): string {
	const value = (image ?? "").trim();
	if (!value) return "";
	if (value !== "api") return value;
	if (randomCoverApis.length === 0) return "";
	return appendSeedParam(randomCoverApis[0], getSeedHash(seed));
}

/**
 * 获取所有随机封面图 API URL 列表（带 seed 参数）。
 * 客户端可按顺序尝试，第一个成功即使用，全部失败则显示回退图。
 */
export function getApiUrlList(
	image: string | undefined | null,
	seed?: string,
): string[] {
	if (!isApiCover(image)) return [];
	const hash = getSeedHash(seed);
	return randomCoverApis.map((api) => appendSeedParam(api, hash));
}
