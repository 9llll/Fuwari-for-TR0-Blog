/**
 * 全站图片服务：统一输出 AVIF
 *
 * Astro 内置的 sharp 服务默认输出 WebP（DEFAULT_OUTPUT_FORMAT = "webp"）。
 * 本项目要求文章内图片统一为 AVIF 格式（同画质下比 WebP 再小约 20%~30%）。
 *
 * 实现方式：继承内置 sharp 服务，仅覆写 validateOptions，
 * 在调用方未显式指定 format 时把默认输出格式改为 "avif"。
 *
 * 注意：
 * - 显式指定 format 的调用方（如 <Image format="webp">）不受影响，仍按其指定输出
 * - SVG 源图保持 SVG 输出（Astro 对 SVG 有专门处理，转码会报错）
 * - 远程图片（http/https）不经过本服务，仍由浏览器直接加载原图
 */
import sharpService from "astro/assets/services/sharp";

/** 本项目统一使用的输出格式 */
const OUTPUT_FORMAT = "avif";

const avifService = {
	...sharpService,

	validateOptions(options, imageConfig) {
		// 必须在调用内置服务之前记录：内置服务会把未指定的 format
		// 补成默认的 "webp"，之后再判断就分不清是「显式指定」还是「默认值」了
		const hadExplicitFormat = Boolean(options.format);

		const validated = sharpService.validateOptions(options, imageConfig);

		// SVG 源图保持原格式，避免 UnsupportedImageConversion 报错
		const isSvg =
			validated.src &&
			typeof validated.src === "object" &&
			validated.src.format === "svg";

		if (!isSvg && !hadExplicitFormat) {
			validated.format = OUTPUT_FORMAT;
		}

		return validated;
	},
};

export default avifService;
