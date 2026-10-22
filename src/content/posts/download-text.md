---
title: '下载按钮演示'
published: 2026-10-01
draft: false
image: "/images/post-cover.webp"
category: ["教程"]
tags: ["教程"]
pinned: true
---


::github{repo="onexru/Fuwari-for-TR0-Blog"}

::download{title="羡鱼资源" source="下载来源" url="https://github.com/onexru/Fuwari-for-TR0-Blog"}

::download{title="带提取码的下载" desc="示例：网盘资源需要提取码" size="12.4 MB" code="8888" url="https://github.com/onexru/Fuwari-for-TR0-Blog"}

::download{title="加密的下载" desc="示例：需要密码才能下载" size="8.6 MB" password="1234" hint="提示：四位数字1234" url="https://github.com/onexru/Fuwari-for-TR0-Blog"}
在文章正文里用 `::download{...}` 指令即可插入下载按钮，**可以放在文章任意位置**（标题下、正文中间、末尾都行）。

## 最简用法

```markdown
::download{title="羡鱼资源" url="https://github.com/onexru/Fuwari-for-TR0-Blog"}
```

## 支持的属性

| 属性 | 说明 | 示例 |
| --- | --- | --- |
| `url` | **必填**，下载地址。必须是 http(s) 或 `/` 开头的站内路径 | `"/downloads/demo.zip"` |
| `title` | 资源名称（`name` 为同义别名） | `"示例包"` |
| `desc` | 资源简介（`source` 为同义别名，兼容旧写法） | `"合集资源，持续更新"` |
| `size` | 文件大小 | `"12.4 MB"` |
| `code` | 网盘提取码，点击一键复制 | `"a1b2"` |
| `hint` | 密码提示，仅在设置密码时有意义 | `"提示：四位数字"` |
| `password` | 访问密码，独立于文章密码 | `"1234"` |
| `icon` | 图标类型：`zip` / `image` / `file` / `lock` / `key` | `"zip"` |

## 完整示例

```markdown
::download{title="带提取码的下载" desc="示例：网盘资源需要提取码" size="12.4 MB" code="a1b2" url="https://example.com/file.zip"}

::download{title="加密的下载" desc="示例：需要密码才能下载" size="8.6 MB" password="1234" hint="提示：四位数字" url="https://example.com/secret.zip"}
```

## 密码保护是怎么工作的

填写 `password` 后：

1. **构建期**把明文密码转成 SHA-256 哈希，写入 HTML 的 `data-dl-hash` 属性
2. **运行时**用 WebCrypto 计算你输入密码的哈希，与之比对
3. 明文密码**不会出现在任何输出文件**中，查看网页源码也看不到

需要注意：这是**访问门禁**而非强加密。校验发生在浏览器端，理论上仍可被绕过。纯静态站点没有后端，做不到真正的服务端鉴权——若需要彻底控制，请配合 Cloudflare Pages Functions 做中转。

## 地址混淆

下载地址在构建期会被 **Base64 编码**后写入 `data-dl-url`，所以：

- 查看网页源码 / F12 Elements 里**搜不到**真实下载地址
- 但点击下载的瞬间，浏览器 Network 面板仍会显示真实地址

这是混淆而非加密，目的是防止地址被批量采集。

## 常见问题

**Q：按钮没显示？**
A：检查属性是否用英文半角引号 `"`，不要用中文全角引号 `“”`；`::` 后面不要加空格；指令要单独成段，不要放在代码块里。

**Q：密码填对了还是提示错误？**
A：确认密码前后没有多余空格（两端空格会被自动去除，但中间的会保留）。

**Q：点击下载会跳走离开本站？**
A：跨域地址会在新标签页打开（因为浏览器对跨域链接会忽略 `download` 属性），站内路径则直接下载。当前页面不会丢失。

引用文章：
::post{id="cs"}
