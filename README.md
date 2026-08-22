# Arthur Engineer Blog V4

## V4 核心升级

- Markdown 文章系统：正文放在 `content/*.md`
- 通用文章阅读页：`article.html?post=文章slug`
- E-Bike 技术知识库
- 工程项目作品集
- GitHub 个人主页入口
- 视频展示页
- 可下载 PDF 简历
- 站内搜索
- 深色模式
- 响应式手机端
- SVG Logo / 工程师头像占位图
- GitHub Pages 直接部署

## 发布到 GitHub Pages

将压缩包解压后的全部内容上传到 `wshhj.github.io` 仓库根目录。

Pages 设置：
- Source: Deploy from a branch
- Branch: main
- Folder: /(root)

## 新增文章的方法

1. 在 `content/` 新建 Markdown 文件，例如：

   `controller-test.md`

2. 在 `assets/data.js` 的 `posts` 中加入文章信息。

3. 在 `blog.html` 增加文章入口。

文章地址：

`article.html?post=controller-test`

## 修改个人信息

- 首页：`index.html`
- 简历网页：`resume.html`
- PDF 简历：`assets/Arthur-Engineer-Resume.pdf`
- GitHub 地址：搜索 `github.com/wshhj`
- 头像占位图：`assets/icons/avatar.svg`
