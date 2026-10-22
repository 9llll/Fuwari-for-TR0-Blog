import Key from "../i18nKey";
import type { Translation } from "../translation";

export const es: Translation = {
	[Key.home]: "Inicio",
	[Key.about]: "Sobre mí",
	[Key.archive]: "Archivo",
	[Key.search]: "Buscar",

	[Key.tags]: "Etiquetas",
	[Key.categories]: "Categorías",
	[Key.recentPosts]: "Publicaciones recientes",

	[Key.comments]: "Comentarios",

	[Key.untitled]: "Sin título",
	[Key.uncategorized]: "Sin categoría",
	[Key.noTags]: "Sin etiquetas",

	[Key.wordCount]: "palabra",
	[Key.wordsCount]: "palabras",
	[Key.minuteCount]: "minuto",
	[Key.minutesCount]: "minutos",
	[Key.postCount]: "publicación",
	[Key.postsCount]: "publicaciones",

	[Key.themeColor]: "Color del tema",

	[Key.lightMode]: "Claro",
	[Key.darkMode]: "Oscuro",
	[Key.systemMode]: "Sistema",

	[Key.more]: "Más",

	[Key.author]: "Autor",
	[Key.publishedAt]: "Publicado el",
	[Key.license]: "Licencia",

	/* Download widget */
	[Key.downloadAction]: "Descargar",
	[Key.downloadSource]: "Fuente",
	[Key.downloadLocked]: "Cifrado",
	[Key.downloadCode]: "Código",
	[Key.downloadCodeCopied]: "Copiado",
	[Key.downloadCodeCopyHint]: "Haz clic para copiar el código: {code}",
	[Key.downloadUnlockTitle]: "Se requiere contraseña",
	[Key.downloadUnlockDesc]:
		"Este recurso está cifrado. Introduce la contraseña para continuar.",
	[Key.passwordPlaceholder]: "Introduce la contraseña",
	[Key.passwordHint]: "Pista",
	[Key.downloadUnlockSubmit]: "Confirmar",
	[Key.downloadCancel]: "Cancelar",
	[Key.downloadUnlockError]: "Contraseña incorrecta",
};
