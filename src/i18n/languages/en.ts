import Key from "../i18nKey";
import type { Translation } from "../translation";

export const en: Translation = {
	[Key.home]: "Home",
	[Key.about]: "About",
	[Key.archive]: "Archive",
	[Key.search]: "Search",

	[Key.tags]: "Tags",
	[Key.categories]: "Categories",
	[Key.recentPosts]: "Recent Posts",

	[Key.comments]: "Comments",

	[Key.untitled]: "Untitled",
	[Key.uncategorized]: "Uncategorized",
	[Key.noTags]: "No Tags",

	[Key.wordCount]: "word",
	[Key.wordsCount]: "words",
	[Key.minuteCount]: "minute",
	[Key.minutesCount]: "minutes",
	[Key.postCount]: "post",
	[Key.postsCount]: "posts",

	[Key.themeColor]: "Theme Color",

	[Key.lightMode]: "Light",
	[Key.darkMode]: "Dark",
	[Key.systemMode]: "System",

	[Key.more]: "More",

	[Key.author]: "Author",
	[Key.publishedAt]: "Published at",
	[Key.license]: "License",

	/* Download widget */
	[Key.downloadAction]: "Download",
	[Key.downloadSource]: "Source",
	[Key.downloadLocked]: "Encrypted",
	[Key.downloadCode]: "Code",
	[Key.downloadCodeCopied]: "Copied",
	[Key.downloadCodeCopyHint]: "Click to copy code: {code}",
	[Key.downloadUnlockTitle]: "Password required",
	[Key.downloadUnlockDesc]:
		"This resource is encrypted. Enter the password to continue.",
	[Key.passwordPlaceholder]: "Enter the password",
	[Key.passwordHint]: "Hint",
	[Key.downloadUnlockSubmit]: "Confirm",
	[Key.downloadCancel]: "Cancel",
	[Key.downloadUnlockError]: "Incorrect password",
};
