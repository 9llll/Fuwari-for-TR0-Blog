/**
 * ::btn / ::video 指令的样式常量
 *
 * 这些类名以字面量形式写在本文件里，Tailwind 的静态扫描才能识别并生成对应 CSS。
 * 样式集中在此处，改一次即可影响全站所有按钮与视频，无需逐篇文章调整。
 */

/** 按钮基础样式（所有 variant 共用） */
export const btnBase =
	"inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 " +
	"text-[0.95rem] font-semibold leading-tight transition-all cursor-pointer select-none " +
	"active:scale-[0.97] my-1.5 mr-1.5 align-middle !no-underline";

/* 下面几个变体的颜色/背景都带 ! 修饰符，原因有二：
 *   1. .prose a 与 .custom-md a:not(.no-styling) 这类全局链接规则
 *      会把 color 强制成主色、并加上虚线下划线；
 *   2. 它们的优先级 (0,1,1)/(0,2,1) 高于 Tailwind 工具类的 (0,1,0)，
 *      不加 !important 的话主色实心按钮的文字会和背景同色，文字直接看不见。
 * Tailwind 的 ! 修饰符生成 !important 声明，可以稳定压过这些规则。 */

/** variant=primary —— 实心主色（默认） */
export const btnPrimary =
	"!text-white !bg-[var(--primary)] shadow-sm hover:brightness-110";

/** variant=secondary —— 浅底主色 */
export const btnSecondary =
	"!bg-[var(--primary-soft)] !text-[var(--primary)] hover:!bg-[var(--primary-soft-hover)]";

/** variant=outline —— 描边 */
export const btnOutline =
	"!border !border-[var(--primary)] !text-[var(--primary)] !bg-transparent hover:!bg-[var(--primary-soft)]";

/** variant=ghost —— 无边框，悬停才显形 */
export const btnGhost =
	"!text-[var(--primary)] !bg-transparent hover:!bg-[var(--primary-soft)]";

/** 所有可用的按钮变体 */
export const btnVariants: Record<string, string> = {
	primary: btnPrimary,
	secondary: btnSecondary,
	outline: btnOutline,
	ghost: btnGhost,
};

/** 视频外层容器：固定宽高比，内容绝对定位铺满 */
export const videoWrapper =
	"not-prose my-4 w-full relative overflow-hidden rounded-xl bg-black/5 dark:bg-white/5";

/** 容器内铺满的 iframe / video */
export const videoFill = "absolute inset-0 h-full w-full";

/** <video> 元素：保持自身比例，多余部分留黑边 */
export const videoMedia =
	"video-media absolute inset-0 h-full w-full object-contain";

/** 视频下方的标题说明 */
export const videoCaption =
	"mt-2 text-center text-[0.8rem] leading-snug text-black/50 dark:text-white/50";
