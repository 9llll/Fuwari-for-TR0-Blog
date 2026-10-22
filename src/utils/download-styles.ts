/**
 * 下载按钮的样式类名
 *
 * 与 rehype-component-download.mjs（正文 ::download 指令）共用，
 * 避免样式在多处渲染路径上漂移。
 *
 * 注意：Fuwari 使用 Tailwind v3，CSS 变量写法是 bg-[var(--primary)]，
 * 不能用 Tailwind v4 的 bg-(--primary) 简写。
 */

/** 行容器 */
export const dlRow =
	"dl-row group flex flex-wrap items-center gap-2 sm:gap-3 rounded-2xl px-3.5 sm:px-4 py-3 " +
	"bg-[var(--license-block-bg)] border border-[var(--line-divider)] transition-all duration-200 " +
	"hover:border-[var(--primary)]/40 hover:shadow-sm";

/** 左侧徽章 */
export const dlBadge =
	"dl-badge shrink-0 grid place-items-center w-10 h-10 sm:w-11 sm:h-11 rounded-2xl " +
	"bg-[var(--primary)] text-white shadow-sm";

/** 中间信息列 */
export const dlInfo = "dl-info flex-1 min-w-[10rem] flex flex-col gap-0.5";

/** 资源名称 */
export const dlName =
	"dl-name flex items-center gap-1.5 text-[0.95rem] font-bold " +
	"text-black/85 dark:text-white/85 min-w-0";

/** 文件大小（小字标签） */
export const dlSize =
	"dl-size text-[0.7rem] font-normal text-black/40 dark:text-white/40 shrink-0";

/** 锁标记 */
export const dlLock =
	"dl-lock mr-1.5 inline-flex items-center gap-0.5 rounded-md bg-[var(--primary)]/12 " +
	"px-1.5 py-0.5 text-[0.65rem] font-medium text-[var(--primary)] shrink-0 align-middle";

/** 副信息行（锁标记 + 简介 + 大小，自然文本流换行） */
export const dlMeta =
	"dl-meta min-w-0 text-[0.8rem] leading-snug text-black/55 dark:text-white/55";

/** 资源简介 */
export const dlDesc = "dl-desc break-words";

/** 右侧操作区 */
export const dlActions =
	"dl-actions flex items-center gap-2 shrink-0 max-[560px]:w-full max-[560px]:justify-end";

/** 提取码按钮（浅色） */
export const dlCodeBtn =
	"dl-code inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[0.8rem] font-medium " +
	"bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)]/20 active:scale-[0.97] " +
	"transition-all cursor-pointer select-none whitespace-nowrap max-[560px]:flex-1";

/** 下载按钮（实心主色） */
export const dlDownloadBtn =
	"dl-download inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-[0.9rem] font-semibold " +
	"text-white bg-[var(--primary)] shadow-sm hover:brightness-110 active:scale-[0.97] " +
	"transition-all cursor-pointer select-none whitespace-nowrap max-[560px]:flex-1";
