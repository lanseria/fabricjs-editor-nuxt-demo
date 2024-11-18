# 证书设计项目

## 项目标题

证书设计工具

## 项目描述

本项目旨在提供一个用户友好的证书设计工具，允许用户自定义和设计个性化的证书。该工具支持多种功能，包括重置、预览、导入导出等，旨在帮助用户轻松创建和管理证书。

## 功能

- **重置/预览/导入导出**：模拟保存与重新获取功能。
- **画布大小设置**：用户可以根据需要调整画布的大小。
- **设置证书背景**：选择或自定义证书的背景。
- **支持自定义图片**：用户可以上传自己的图片作为证书的一部分。
- **证书模板文字信息**：提供预设的文本信息供用户选择。
- **自定义文字信息**：允许用户输入和编辑自己的文字信息。
- **字体自定义**：对单一文字的颜色、字体大小和样式进行自定义设置。

## 分支说明

- **tp-ui**：该分支包含证书设计工具的所有功能，为用户提供全面的解决方案。
- **bst-ui**：该分支是另一个 Fabric.js 应用项目，允许用户在图片上绘制区域，展示不同的功能。

## 技术栈

- **Nuxt 3**：基于 Vue.js 的强大框架，支持服务器端渲染和静态站点生成，提供直观的开发体验。
- **Fabric.js@5**：一个用于处理 HTML5 canvas 的 JavaScript 库，允许丰富的交互图形和对画布上对象的简单操作。

Citations:
[1] https://chaoscode.io/resources/teleportgui.22/
[2] https://juejin.cn/post/7170746000112353293
[3] https://gist.github.com/fikoopik/a186d634577d5c4abdb53d0c57a53090
[4] https://goteleport.com/docs/connect-your-client/web-ui/
[5] https://blog.csdn.net/qq_40323256/article/details/130053875
[6] https://nuxt.com
[7] https://github.com/intlify/nuxt3
[8] https://nuxt.com/docs/getting-started/introduction

## 安装与运行

1. 克隆项目到本地：
   ```bash
   git clone https://github.com/lanseria/fabricjs-editor-nuxt-demo
   ```
2. 进入项目目录：
   ```bash
   cd fabricjs-editor-nuxt-demo
   ```
3. 安装依赖（如果有）：
   ```bash
   pnpm install
   ```
4. 启动应用：
   ```bash
   pnpm dev
   ```

## 如何使用项目

1. 打开应用程序，选择画布大小。
2. 设置背景和上传自定义图片。
3. 输入证书模板文字信息及自定义文字信息。
4. 调整字体颜色、大小及样式。
5. 使用“预览”功能查看最终效果，必要时进行调整。
6. 完成后，可以选择导出证书或保存项目。

## 许可证

本项目采用 MIT 许可证。有关详细信息，请参阅 LICENSE 文件。

## 联系方式

如有疑问或建议，请联系我：[zhangchao564265135@hotmail.com]。

Citations:
[1] https://www.freecodecamp.org/news/how-to-write-a-good-readme-file/
