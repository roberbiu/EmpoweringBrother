<div align="center">

# 🎯 Valorant Aim Trainer

**一款专为 Valorant 玩家设计的网页端瞄准训练工具**

*A web-based aim training tool designed specifically for Valorant players*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.x-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646cff.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38bdf8.svg)](https://tailwindcss.com/)

[在线体验 Demo](https://empowering-brother.vercel.app) · [报告问题 Issues](https://github.com/sleepland/empowering-brother/issues) · [功能建议 Feature Request](https://github.com/sleepland/empowering-brother/issues)

</div>

---

# 中文文档

## 📖 项目简介

**Valorant Aim Trainer** 是一款基于浏览器的 FPS 瞄准训练工具，专门针对 Valorant 游戏进行优化。它支持真实的游戏内灵敏度设置，让你可以在任何地方使用与游戏中完全一致的鼠标手感进行练习。

无需下载安装任何软件，打开浏览器即可开始训练。简洁低调的界面设计，让你可以在工作间隙悄悄提升枪法。

## 💡 开发动机与背景故事

### 痛点问题

作为一名 Valorant 玩家，我发现现有的瞄准训练工具存在以下问题：

1. **灵敏度不匹配**：大多数网页端训练器无法精确匹配 Valorant 的灵敏度设置，导致练习时的肌肉记忆与实际游戏不一致
2. **需要安装软件**：Aim Lab、Kovaak's 等专业训练器需要下载安装，且启动时间较长
3. **界面过于花哨**：很多训练器界面复杂，不适合在办公环境中使用
4. **缺乏中文支持**：国际化支持不足，对中文用户不够友好

### 解决方案

本项目通过以下方式解决这些痛点：

- **精确的灵敏度换算**：基于 Valorant 官方 Yaw 值（0.07）实现精确的 DPI/灵敏度换算，支持 eDPI 和 cm/360 显示
- **零安装即用**：纯前端静态应用，打开网页即可使用，无需任何安装
- **低调简洁界面**：深色主题 + 极简设计，看起来像是在认真工作
- **中英双语支持**：默认中文界面，一键切换英文

### 技术挑战

开发过程中克服的主要技术挑战：

1. **Pointer Lock API**：实现 FPS 游戏风格的鼠标捕获，支持原始鼠标输入（禁用系统加速）
2. **灵敏度计算**：研究 Valorant 的灵敏度机制，实现精确的网页端灵敏度映射
3. **高性能渲染**：使用 Canvas 2D + requestAnimationFrame 实现流畅的 60fps 游戏循环

## ✨ 主要功能特性

### 🎮 五种训练模式

| 模式 | 描述 | 训练目标 |
|------|------|----------|
| ⚡ **反应速度** | 目标随机出现，尽快点击 | 提升反应时间 |
| 🎯 **甩枪练习** | 目标出现在不同位置 | 训练快速瞄准 |
| 🔄 **追踪训练** | 目标持续移动 | 提升追踪能力 |
| ⊞ **网格射击** | 多目标同时出现 | 训练目标切换 |
| 💀 **爆头线** | 目标出现在头部高度 | 培养爆头意识 |

### ⚙️ 灵敏度设置

- 支持输入鼠标 DPI 和 Valorant 游戏内灵敏度
- 自动计算 eDPI（有效 DPI）
- 显示 cm/360（转一圈需要移动的厘米数）
- 灵敏度分类提示（低/中/高）

### 📊 数据统计

- 实时显示命中率、得分、反应时间
- 训练结束后显示详细统计报告
- 反应时间分布直方图
- 历史记录保存与趋势分析

### 🎨 自定义选项

- 准星颜色和大小调节
- 目标大小（小/中/大）
- 难度等级（简单/中等/困难）
- 显示/隐藏实时统计

### 🌐 国际化

- 中文/英文双语支持
- 默认中文，一键切换
- 语言偏好自动保存

## 🛠️ 技术栈

| 类别 | 技术 | 说明 |
|------|------|------|
| **框架** | React 18 | 现代化 UI 框架 |
| **语言** | TypeScript | 类型安全的 JavaScript |
| **构建** | Vite 5 | 极速开发服务器和构建工具 |
| **状态管理** | Zustand | 轻量级状态管理方案 |
| **样式** | TailwindCSS 3 | 原子化 CSS 框架 |
| **渲染** | Canvas 2D API | 高性能图形渲染 |
| **鼠标捕获** | Pointer Lock API | FPS 风格鼠标控制 |
| **数据持久化** | localStorage | 浏览器本地存储 |

## 📦 安装与使用指南

### 在线使用

直接访问部署地址即可使用，无需任何安装：

👉 **[https://empowering-brother.vercel.app](https://empowering-brother.vercel.app)**

### 本地开发

#### 环境要求

- Node.js 18.x 或更高版本
- npm 9.x 或更高版本

#### 安装步骤

```bash
# 1. 克隆仓库
git clone https://github.com/sleepland/empowering-brother.git

# 2. 进入项目目录
cd empowering-brother

# 3. 安装依赖
npm install

# 4. 启动开发服务器
npm run dev
```

开发服务器启动后，在浏览器中打开 `http://localhost:5173` 即可。

#### 构建部署

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

构建产物位于 `dist/` 目录，可直接部署到任何静态托管服务。

### 使用说明

1. **设置灵敏度**：点击右上角齿轮图标，输入你的鼠标 DPI 和 Valorant 游戏内灵敏度
2. **选择模式**：点击顶部的训练模式按钮（或使用数字键 1-5 快捷切换）
3. **开始训练**：点击游戏区域开始，鼠标会被锁定
4. **结束训练**：按 ESC 键退出，查看训练统计

### 快捷键

| 快捷键 | 功能 |
|--------|------|
| `1-5` | 切换训练模式 |
| `Click` | 开始游戏 / 射击 |
| `ESC` | 结束训练 |

## 📚 参考资料与致谢

### 技术参考

- [Valorant Wiki - Sensitivity](https://valorant.fandom.com/wiki/Sensitivity) - Valorant 灵敏度机制说明
- [Mouse Sensitivity Calculator](https://www.mouse-sensitivity.com/) - 跨游戏灵敏度换算
- [MDN - Pointer Lock API](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API) - 鼠标锁定 API 文档
- [React Documentation](https://react.dev/) - React 官方文档
- [Zustand](https://github.com/pmndrs/zustand) - 状态管理库

### 灵感来源

- [Aim Lab](https://aimlab.gg/) - 专业瞄准训练软件
- [3D Aim Trainer](https://www.3daimtrainer.com/) - 网页端 3D 瞄准训练
- [Human Benchmark](https://humanbenchmark.com/) - 反应速度测试网站

### 特别感谢

- 感谢所有在开发过程中提供反馈和建议的朋友们
- 感谢开源社区提供的优秀工具和库

## 🤝 贡献指南

欢迎任何形式的贡献！无论是报告 Bug、提出新功能建议，还是提交代码改进。

### 如何贡献

1. **Fork** 本仓库
2. 创建你的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 **Pull Request**

### 开发规范

- 使用 TypeScript 编写代码，确保类型安全
- 遵循现有的代码风格和命名规范
- 提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范
- 新功能需要编写相应的注释说明

### 问题反馈

如果你发现了 Bug 或有功能建议，请通过 [GitHub Issues](https://github.com/sleepland/empowering-brother/issues) 提交。

## 📄 开源许可证

本项目基于 **MIT 许可证** 开源。

```
MIT License

Copyright (c) 2024 sleepland

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

# English Documentation

## 📖 Introduction

**Valorant Aim Trainer** is a browser-based FPS aim training tool specifically optimized for Valorant. It supports real in-game sensitivity settings, allowing you to practice with the exact same mouse feel as in the game, anywhere you are.

No downloads or installations required - just open your browser and start training. The clean, low-key interface design lets you quietly improve your aim during work breaks.

## 💡 Motivation & Background Story

### Pain Points

As a Valorant player, I found that existing aim training tools have the following problems:

1. **Sensitivity Mismatch**: Most web-based trainers cannot accurately match Valorant's sensitivity settings, causing muscle memory inconsistency between practice and actual gameplay
2. **Installation Required**: Professional trainers like Aim Lab and Kovaak's require downloads and have long startup times
3. **Flashy Interfaces**: Many trainers have complex interfaces that aren't suitable for office environments
4. **Lack of Localization**: Poor internationalization support, not friendly for non-English users

### Solutions

This project addresses these pain points through:

- **Precise Sensitivity Conversion**: Accurate DPI/sensitivity conversion based on Valorant's official Yaw value (0.07), with eDPI and cm/360 display
- **Zero Installation**: Pure frontend static application, ready to use when you open the webpage
- **Clean & Discreet Interface**: Dark theme + minimalist design, looks like you're working seriously
- **Bilingual Support**: Chinese interface by default, one-click switch to English

### Technical Challenges

Major technical challenges overcome during development:

1. **Pointer Lock API**: Implementing FPS-style mouse capture with raw mouse input (disabling system acceleration)
2. **Sensitivity Calculation**: Researching Valorant's sensitivity mechanism and implementing accurate web-based sensitivity mapping
3. **High-Performance Rendering**: Using Canvas 2D + requestAnimationFrame for smooth 60fps game loop

## ✨ Key Features

### 🎮 Five Training Modes

| Mode | Description | Training Goal |
|------|-------------|---------------|
| ⚡ **Reaction** | Targets appear randomly, click as fast as possible | Improve reaction time |
| 🎯 **Flick** | Targets appear at different positions | Train quick aiming |
| 🔄 **Tracking** | Targets move continuously | Improve tracking ability |
| ⊞ **Gridshot** | Multiple targets appear simultaneously | Train target switching |
| 💀 **Headshot** | Targets appear at head height | Develop headshot awareness |

### ⚙️ Sensitivity Settings

- Input mouse DPI and Valorant in-game sensitivity
- Auto-calculate eDPI (effective DPI)
- Display cm/360 (centimeters to complete a 360° turn)
- Sensitivity classification tips (Low/Medium/High)

### 📊 Statistics

- Real-time display of accuracy, score, reaction time
- Detailed statistics report after training
- Reaction time distribution histogram
- History saving and trend analysis

### 🎨 Customization Options

- Crosshair color and size adjustment
- Target size (Small/Medium/Large)
- Difficulty level (Easy/Medium/Hard)
- Show/hide real-time statistics

### 🌐 Internationalization

- Chinese/English bilingual support
- Chinese by default, one-click switch
- Language preference auto-saved

## 🛠️ Tech Stack

| Category | Technology | Description |
|----------|------------|-------------|
| **Framework** | React 18 | Modern UI framework |
| **Language** | TypeScript | Type-safe JavaScript |
| **Build Tool** | Vite 5 | Lightning-fast dev server and build tool |
| **State Management** | Zustand | Lightweight state management |
| **Styling** | TailwindCSS 3 | Utility-first CSS framework |
| **Rendering** | Canvas 2D API | High-performance graphics rendering |
| **Mouse Capture** | Pointer Lock API | FPS-style mouse control |
| **Data Persistence** | localStorage | Browser local storage |

## 📦 Installation & Usage Guide

### Online Usage

Visit the deployed URL directly, no installation required:

👉 **[https://empowering-brother.vercel.app](https://empowering-brother.vercel.app)**

### Local Development

#### Requirements

- Node.js 18.x or higher
- npm 9.x or higher

#### Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/sleepland/empowering-brother.git

# 2. Enter project directory
cd empowering-brother

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev
```

After the dev server starts, open `http://localhost:5173` in your browser.

#### Build for Production

```bash
# Build production version
npm run build

# Preview build result
npm run preview
```

Build output is in the `dist/` directory, ready to deploy to any static hosting service.

### Usage Instructions

1. **Set Sensitivity**: Click the gear icon in the top right, enter your mouse DPI and Valorant in-game sensitivity
2. **Select Mode**: Click training mode buttons at the top (or use number keys 1-5 for quick switch)
3. **Start Training**: Click on the game area to start, mouse will be locked
4. **End Training**: Press ESC to exit and view training statistics

### Keyboard Shortcuts

| Shortcut | Function |
|----------|----------|
| `1-5` | Switch training modes |
| `Click` | Start game / Shoot |
| `ESC` | End training |

## 📚 References & Acknowledgments

### Technical References

- [Valorant Wiki - Sensitivity](https://valorant.fandom.com/wiki/Sensitivity) - Valorant sensitivity mechanism documentation
- [Mouse Sensitivity Calculator](https://www.mouse-sensitivity.com/) - Cross-game sensitivity conversion
- [MDN - Pointer Lock API](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API) - Pointer Lock API documentation
- [React Documentation](https://react.dev/) - Official React documentation
- [Zustand](https://github.com/pmndrs/zustand) - State management library

### Inspiration

- [Aim Lab](https://aimlab.gg/) - Professional aim training software
- [3D Aim Trainer](https://www.3daimtrainer.com/) - Web-based 3D aim trainer
- [Human Benchmark](https://humanbenchmark.com/) - Reaction time testing website

### Special Thanks

- Thanks to all friends who provided feedback and suggestions during development
- Thanks to the open source community for providing excellent tools and libraries

## 🤝 Contributing

Contributions of any kind are welcome! Whether it's reporting bugs, suggesting new features, or submitting code improvements.

### How to Contribute

1. **Fork** this repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a **Pull Request**

### Development Guidelines

- Write code in TypeScript to ensure type safety
- Follow existing code style and naming conventions
- Commit messages should follow [Conventional Commits](https://www.conventionalcommits.org/) specification
- New features should include appropriate comments and documentation

### Issue Reporting

If you find a bug or have a feature suggestion, please submit it via [GitHub Issues](https://github.com/sleepland/empowering-brother/issues).

## 📄 License

This project is open source under the **MIT License**.

```
MIT License

Copyright (c) 2024 sleepland

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">

**如果这个项目对你有帮助，请给一个 ⭐ Star 支持！**

*If this project helps you, please give it a ⭐ Star!*

Made with ❤️ by [sleepland](https://github.com/sleepland)

</div>
