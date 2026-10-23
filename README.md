# Fuwari-for-TR0-Blog

基于 [Fuwari](https://github.com/saicaca/fuwari) 深度魔改的静态博客，站点为 **羡鱼资源**（<https://www.3x3.top>）。

在原版基础上补齐了中文博客常用但 Fuwari 缺失的能力：分类体系、下载按钮、文章引用卡片、链接按钮、视频播放器、随机封面等，并针对中文排版做了若干适配。

---

## ✨ 功能特性

### 内容与组织

- **分类体系** — 原版 Fuwari 没有分类，本项目补上了分类字段、分类侧边栏，以及归档页按分类筛选
- **标签体系** — 标签字段、标签云侧边栏，以及归档页按标签筛选
- **文章置顶** — `pinned: true` 的文章固定排在列表最前
- **归档页** — 按年份月份分组，支持 `?category=` / `?tag=` / `?uncategorized=` 筛选
- **独立搜索** — 基于 [Pagefind](https://pagefind.app/)，无需后端
- **文章阅读时长 / 字数统计**
- **文章摘要** — 列表页自动截取正文摘要
- **评论区** — 内置 [Artalk](https://github.com/ArtalkJS/Artalk) 评论

### 自定义 Markdown 指令

在标准 Markdown 之外扩展了以下指令，完整用法见站内文章《自定义指令说明：按钮与视频》。

| 指令 | 用途 |
| --- | --- |
| `::download{...}` | 下载按钮，支持网盘提取码、访问密码保护、真实地址 Base64 混淆 |
| `::btn{...}` | 链接按钮，四种样式变体 + 八种内置图标 |
| `::video{...}` | 视频播放器，支持 B 站 / YouTube / 本地文件，固定宽高比自适应 |
| `::post{id="..."}` | 在文章中引用另一篇文章的卡片 |
| `::github{repo="..."}` | GitHub 仓库卡片 |
| `::note{}` `::tip{}` `::important{}` `::caution{}` `::warning{}` | 五种提示框 |

> `::download` 的访问密码在**构建期**转为 SHA-256 哈希写入 `data-dl-hash`，
> 明文密码不会出现在任何输出文件中；真实下载地址也会被 Base64 编码，查看网页源码搜不到。

### 其它改进

- **全站图片统一 AVIF** — 自定义图片服务，产物图片默认输出 AVIF（同画质下比 WebP 小约 30~55%）
- **随机封面图** — `image: api` 可按文章 id 生成稳定的随机封面
- **渐变占位封面** — 未指定封面图时按文章类型生成带角标的渐变占位图
- **移动端适配** — 表格在窄屏下自动换行完整展示、不需横向滑动；GitHub 卡片在窄屏下自适应换行
- **深浅色主题** — 主题色（色相）可调，站内所有按钮与配色自动跟随
- **侧边栏** — 头像、分类、标签、目录、显示设置等组件，移动端折叠为侧边栏
- **代码块增强** — [Expressive Code](https://expressive-code.com/)，支持代码折叠、行号、语言徽章、一键复制

---

## 🚀 快速开始

### 环境要求

| 项目 | 版本 |
| --- | --- |
| Node.js | >= 20 |
| pnpm | >= 9 |

本项目使用 pnpm 锁定依赖（`preinstall` 里限制了只允许 pnpm 安装）。

```bash
# 安装依赖
pnpm install

# 启动本地开发服务器（http://localhost:4321）
pnpm run start     # 或 pnpm dev

# 构建生产版本（产物在 dist/，同时生成 Pagefind 搜索索引）
pnpm run build

# 本地预览构建产物
pnpm run preview
```

### 创建新文章

```bash
pnpm new-post <文件名>
```

脚本会在 `src/content/posts/` 下生成带 frontmatter 的 Markdown 骨架，填好内容即可。

---

## ✍️ 文章 Frontmatter

```yaml
---
title: 文章标题
published: 2026-10-23        # 发布日期
updated: 2026-10-23          # 更新日期（可选）
description: 文章摘要         # 用于列表页与 SEO
draft: false                 # 草稿，true 时不进入生产构建
pinned: false                # 置顶，true 时排在列表最前
image: api                   # 封面图，见下方说明
category: ["游戏源码"]        # 分类（数组，也兼容单字符串写法）
tags: ["源码", "游戏"]         # 标签
comment: true                # 是否开启评论
---
```

### 封面图 `image` 的三种写法

| 写法 | 效果 |
| --- | --- |
| 省略 / 留空 | 使用渐变占位封面，按文章类型自动选择图标与角标 |
| `api` | 使用随机封面图（按文章 id 生成，同一篇文章封面固定不变） |
| 具体路径 | 使用指定图片，如 `src/assets/images/x.webp` 或 `/images/x.png` |

图片路径支持多种写法，构建时会被解析成实际可访问的地址：

- `src/assets/images/x.webp` — 相对 `src/` 根目录（走 Astro 优化）
- `assets/images/x.webp` — 同上
- `cover.avif` — 与文章同目录
- `/images/x.png` — `public/` 下的绝对路径（原样引用，不做优化）

---

## ⚙️ 配置说明

站点配置集中在 **`src/config.ts`**，改这一个文件即可：

| 导出项 | 作用 |
| --- | --- |
| `siteConfig` | 站点标题、SEO 关键词与描述、语言、主题色、背景图、目录、站点图标 |
| `navBarConfig` | 顶部导航栏链接 |
| `profileConfig` | 侧边栏个人资料：昵称、头像、简介、社交链接 |
| `licenseConfig` | 文章底部许可证信息 |
| `expressiveCodeConfig` | 代码块主题 |
| `friends` | 友情链接列表 |

站点级配置在 **`astro.config.mjs`**：

| 配置项 | 作用 |
| --- | --- |
| `site` | 站点域名，影响 SEO 与 RSS |
| `image.service` | 图片服务，本项目接入了自定义 AVIF 服务 |
| `markdown.remarkPlugins` | Markdown 插件链 |
| `markdown.rehypePlugins` | HTML 插件链与自定义组件注册 |
| `integrations` | Tailwind、Expressive Code、Iconify、Svelte、Sitemap |

### 添加自定义图标

站点图标来自 [Iconify](https://icones.js.org/)，`astro.config.mjs` 的 `icon.include` 中已启用
`material-symbols`、`mdi`、`fa6-solid`、`fa6-regular`、`fa6-brands`。需要更多图标集时，
安装对应的 `@iconify-json/*` 包并加进这个列表即可。

---

## 📁 目录结构

```
src/
├── components/          # 组件
│   ├── control/         # 翻页、返回顶部、标签按钮
│   ├── misc/            # Markdown 容器、图片包装、封面占位、许可证
│   └── widget/          # 侧边栏组件：分类、标签、目录、资料、显示设置
├── content/
│   ├── config.ts        # 内容集合 schema（文章 frontmatter 校验）
│   ├── posts/           # 文章 Markdown
│   └── spec/            # 关于页等长文内容
├── i18n/                # 多语言（en / zh_CN / zh_TW / ja / ko / es / th / vi / tr / id）
├── layouts/             # 页面布局
├── pages/               # 路由
│   ├── api/             # 文章 JSON 接口
│   └── page/            # 分页路由
├── plugins/             # Markdown 插件与自定义组件
│   ├── rehype-component-*.mjs   # 指令渲染组件
│   ├── remark-*.mjs/.js          # Markdown 解析插件
│   └── image-service-avif.mjs    # 自定义图片服务（统一 AVIF）
├── styles/              # 全局样式
├── types/               # 类型定义
└── utils/               # 工具函数（封面图、下载、URL、日期等）
```

---

## 📦 常用命令

| 命令 | 说明 |
| --- | --- |
| `pnpm install` | 安装依赖 |
| `pnpm dev` / `pnpm start` | 启动开发服务器 |
| `pnpm build` | 构建生产版本 + 生成搜索索引 |
| `pnpm preview` | 预览构建产物 |
| `pnpm check` | 类型检查（Astro Check） |
| `pnpm lint` | Biome 检查并自动修复 |
| `pnpm format` | Biome 格式化 |
| `pnpm new-post <文件名>` | 新建文章 |
| `pnpm astro ...` | 透传 Astro CLI |

> **修改插件或样式后如果构建产物没变化**，先清掉缓存再构建：
> `rm -rf node_modules/.vite node_modules/.astro .astro`

---

## 🚢 部署

仓库内置 GitHub Actions 工作流，推送到 `main` 分支即自动触发：

| 工作流 | 说明 |
| --- | --- |
| `.github/workflows/build.yml` | 构建校验 |
| `.github/workflows/biome.yml` | 代码格式检查 |
| `.github/workflows/deploy.yml` | 部署到 GitHub Pages |

也提供了 `edgeone.json` 与 `vercel.json` 用于 EdgeOne Pages / Vercel 部署。
静态产物输出在 `dist/`，托管到任意静态服务即可。

部署到自己的域名时，记得同步修改 `astro.config.mjs` 里的 `site` 字段，
否则 RSS、站点地图、canonical 链接仍会指向旧域名。

---

## 📄 说明

- 上游项目：[saicaca/fuwari](https://github.com/saicaca/fuwari)
- 生产站点部署在 Cloudflare：<https://www.3x3.top>
- 许可协议：见 [LICENSE](./LICENSE)

部分代码由 AI 辅助构建。
