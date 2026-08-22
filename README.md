# Arthur Blog

一个可直接部署到 GitHub Pages 的纯静态个人博客。

## 文件结构

- `index.html`：首页
- `archive.html`：文章归档
- `about.html`：关于
- `posts/`：文章页面
- `assets/style.css`：样式
- `assets/main.js`：深色模式
- `404.html`：404 页面
- `.nojekyll`：避免 GitHub Pages 的 Jekyll 处理

## GitHub Pages 部署

### 方案 A：个人主页仓库（推荐）

1. 在 GitHub 新建仓库：`你的用户名.github.io`
2. 把本项目全部文件上传到仓库根目录。
3. 打开仓库 `Settings` → `Pages`。
4. `Build and deployment` → `Source` 选择 `Deploy from a branch`。
5. Branch 选择 `main`，目录选择 `/ (root)`。
6. 保存后访问：`https://你的用户名.github.io/`

### 方案 B：普通仓库

例如仓库叫 `blog`，同样在 `Settings` → `Pages` 里选择 `main / (root)`。
通常地址为：`https://你的用户名.github.io/blog/`

> 本模板内部链接使用相对路径，因此普通仓库部署也可以正常使用。

## 发布新文章

1. 复制 `posts/first-post.html`。
2. 修改标题、日期、分类和正文。
3. 在 `archive.html` 增加文章链接。
4. 如需显示在首页，在 `index.html` 增加一张文章卡片。
5. 提交到 GitHub，Pages 会重新发布。

## 自定义

可以修改：
- 网站名：`Arthur Blog`
- 首页介绍
- `about.html`
- CSS 配色和字体
- 文章分类和内容

## 自定义域名

GitHub Pages 支持自定义域名。配置域名后，建议在 Pages 设置中开启 HTTPS。
