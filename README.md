# Arthur Engineer Blog V5

V5 将网站从“个人博客”升级为“长期工程知识平台”。

## V5 新增
- PWA：可安装到桌面 / 手机主屏幕
- Service Worker：核心页面缓存
- RSS：`rss.xml`
- SEO：`sitemap.xml` + `robots.txt`
- 阅读进度条
- 代码块一键复制
- 文章链接复制
- 相关文章推荐
- 项目状态与项目指标
- 首页重点内容
- 技术标签云
- 网站更新日志

## 写新文章
1. 在 `content/` 新建 `.md`
2. 在 `assets/data.js` 增加文章元信息
3. 在 `blog.html` 增加文章入口
4. 链接格式：`article.html?post=slug`

## GitHub Pages
把全部文件上传到 `wshhj.github.io` 仓库根目录。

Pages 设置：
- Deploy from a branch
- main
- /(root)
