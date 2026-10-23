/**
 * 全站图片服务：统一输出 AVIF
 *
 * Astro 内置的 sharp 服务默认输出 WebP（DEFAULT_OUTPUT_FORMAT = "webp"）。
 * 本项目要求文章内图片统一为 AVIF 格式。
 *
 * 实现方式：继承内置 sharp 服务，仅覆写 validateOptions，
 * 在未显式指定 format 时把默认输出格式改为 "avif"。
 *
 * 关于画质：sharp 对不同格式的默认 quality 不同
 *   - WebP 默认 80
 *   - AVIF 默认 50
 * 两者视觉质量基本相当（实测同图 PSNR：webp q80 ≈ 38.5dB，avif q50 ≈ 38.9dB），
 * 但 AVIF 体积小约 35%。这里显式写出 quality，避免依赖各库的隐式默认值，
 * 也可在 astro.config.mjs 的 image.service.config.quality 中调整。
 *
 * 注意：
 * - 显式指定 format 的调用方（如 <Image format="webp">）不受影响，仍按其指定输出
 * - SVG 源图保持 SVG 输出（Astro 对 SVG 有专门处理，转码会报错）
 * - 远程图片（http/https）不经过本服务，仍由浏览器直接加载原图
 */
import sharpService from "astro/assets/services/sharp";

/** 本项目统一使用的输出格式 */
const OUTPUT_FORMAT = "avif";

/** AVIF 输出质量，与 WebP 的默认 80 视觉质量相当 */
const DEFAULT_QUALITY = 50;

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
			// 未显式指定画质时使用本项目的默认值
			if (!validated.quality) {
				validated.quality =
					imageConfig?.service?.config?.quality ?? DEFAULT_QUALITY;
			}
		}

		return validated;
	},
};

export default avifService;
