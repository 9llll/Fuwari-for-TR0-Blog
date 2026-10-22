import Key from "../i18nKey";
import type { Translation } from "../translation";

export const ja: Translation = {
	[Key.home]: "Home",
	[Key.about]: "About",
	[Key.archive]: "Archive",
	[Key.search]: "検索",

	[Key.tags]: "タグ",
	[Key.categories]: "カテゴリ",
	[Key.recentPosts]: "最近の投稿",

	[Key.comments]: "コメント",

	[Key.untitled]: "タイトルなし",
	[Key.uncategorized]: "カテゴリなし",
	[Key.noTags]: "タグなし",

	[Key.wordCount]: "文字",
	[Key.wordsCount]: "文字",
	[Key.minuteCount]: "分",
	[Key.minutesCount]: "分",
	[Key.postCount]: "件の投稿",
	[Key.postsCount]: "件の投稿",

	[Key.themeColor]: "テーマカラー",

	[Key.lightMode]: "ライト",
	[Key.darkMode]: "ダーク",
	[Key.systemMode]: "システム",

	[Key.more]: "もっと",

	[Key.author]: "作者",
	[Key.publishedAt]: "公開日",
	[Key.license]: "ライセンス",

	/* Download widget */
	[Key.downloadAction]: "ダウンロード",
	[Key.downloadSource]: "出所",
	[Key.downloadLocked]: "暗号化",
	[Key.downloadCode]: "提取コード",
	[Key.downloadCodeCopied]: "コピーしました",
	[Key.downloadCodeCopyHint]: "クリックしてコードをコピー: {code}",
	[Key.downloadUnlockTitle]: "パスワードが必要です",
	[Key.downloadUnlockDesc]:
		"このリソースは暗号化されています。続けるにはパスワードを入力してください。",
	[Key.passwordPlaceholder]: "パスワードを入力",
	[Key.passwordHint]: "ヒント",
	[Key.downloadUnlockSubmit]: "確認",
	[Key.downloadCancel]: "キャンセル",
	[Key.downloadUnlockError]: "パスワードが違います",
};
