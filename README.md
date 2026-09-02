# LUKA · CHW Signature Line

LUKA 的 Apple 风格睫角守宫繁育工作室概念站。页面以 **CHW** 作为唯一主角，采用全屏产品发布页节奏：首屏聚焦、全身紫调 CHW 三段滚动叙事、基因谱系切换、档案抽屉和预约流程。

支持展示的主线：

`CHW` · `Sable` · `Sable Lily` · `Lily` · `Ax` · `Ax Lily`

## 本地预览

```bash
cd /Users/minimax/luka-studio
npm run dev
```

然后打开 <http://localhost:4173>。

## 中国境内发布

将项目根目录（`index.html` 与 `assets/` 保持同级）上传到 Gitee 仓库，再在仓库的「服务 → Gitee Pages」中选择发布分支和根目录即可生成站点地址。若绑定自有域名，按平台提示完成域名备案与解析。

目录外提供的 `luka-site-upload.zip`（以及同内容的 `luka-studio.zip`）是可直接解压上传的根目录版本；`luka-studio-site.zip` 保留 `luka-studio/` 外层目录，适合先整体上传或归档。

页面不依赖 Google Fonts 或其他外部 CDN，字体使用系统字体栈；图片、脚本与样式均随站点本地上传，适合 Gitee Pages、对象存储等中国境内托管。

## 交互动画

- 首屏图片缓慢缩放、标题分层淡入、鼠标轻微视差
- 页面顶部滚动进度条与毛玻璃导航
- CHW 三段滚动状态切换（Origin / Structure / Proof）
- CHW 图片交叉淡入、滤镜与进度线变化
- Sable / Sable Lily / Lily / Ax / Ax Lily 标签切换
- 基因档案抽屉、ESC / 背景关闭、移动端菜单
- 数据进入视口时数字滚动
- `prefers-reduced-motion` 自动降低动画

## 基因谱系文案

基因谱系区的五条主线说明采用统一的 LUKA 产品发布页语气：以色彩、留白、背线、覆盖率和成长记录为叙事线索，建立每条主线清晰、克制的视觉坐标。

## 素材说明

`assets/chw-purple-gpt-1.png` 是用户提供的全身紫色睫角守宫主视觉（由原文件“紫色睫角守宫-gpt-1.png”复制为便于静态托管的 ASCII 文件名），CHW 的首屏、滚动叙事与档案抽屉均使用这张图。五条基因线使用 `assets/references/x/` 下按主线整理的影像素材：Sable、Sable Lily、Lily、Ax、Ax Lily 各一组；`gene-*-pending.svg` 为加载失败时的视觉回退，`gecko-*.jpg` 为原有素材备份。完整素材来源与下载记录见 `assets/references/SOURCES.md`。
