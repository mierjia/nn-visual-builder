# 🧠 神经网络可视化搭建器

> 一个功能强大的可视化神经网络搭建工具，通过拖拽组件设计神经网络架构，一键生成 PyTorch / TensorFlow / Keras 代码。

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## ✨ 功能特性

### 🎨 可视化画布
- **拖拽式操作**：从左侧组件库拖拽神经网络组件到画布
- **连接数据流**：用箭头连接不同组件，表示数据流向
- **实时形状计算**：自动计算每个节点的输入/输出张量形状
- **属性编辑**：点击节点即可编辑参数和形状
- **深色/浅色主题**：点击右上角 ☀️/🌙 一键切换，主题偏好自动保存

### 🧩 神经网络组件库（20+ 组件）

| 类别 | 组件 |
|------|------|
| 输入/输出 | `Input` `Output` |
| 卷积层 | `Conv2D` |
| 池化层 | `MaxPool2D` `AvgPool2D` |
| 全连接层 | `Linear` |
| 激活函数 | `ReLU` `Sigmoid` `Tanh` `Softmax` |
| 归一化层 | `BatchNorm2D` `LayerNorm` |
| 形状变换 | `Flatten` `Reshape` `Transpose` |
| Transformer | `Attention` `MultiHeadAttention` `Embedding` |
| 循环网络 | `LSTM` `GRU` |
| 工具层 | `Dropout` `Concat` `Add` |

### 📐 内置模板
内置 8 种经典网络模板：**U-Net**、**ResNet-18**、**VGG-16**、**YOLOv3**、**LSTM 时序**、**Transformer 编码器**、**CNN 分类器**、**LSTM 文本分类**，一键加载。

### 💻 代码生成
- **PyTorch** — 完整的 `nn.Module` 实现
- **TensorFlow** — Keras Functional API
- **Keras** — Sequential 模型
- 一键复制 / 下载 `.py` 文件

---

## 🚀 快速开始

### 环境要求
- **Node.js** >= 18.0.0
- **npm** 或 **yarn**

### 安装 & 启动

```bash
# 1. 克隆仓库
git clone https://github.com/YOUR_USERNAME/nn-visual-builder.git
cd nn-visual-builder

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
```

访问 → [http://localhost:5173](http://localhost:5173)

### 构建生产版本

```bash
npm run build
npm run preview   # 预览构建产物
```

---

## 📖 使用流程

```
1️⃣ 选择组件   →   左侧面板浏览/搜索组件库
2️⃣ 拖拽到画布  →   从左侧拖入中央画布
3️⃣ 设置属性   →   点击节点编辑参数和形状
4️⃣ 连接数据流  →   从输出端口拖拽到输入端口
5️⃣ 生成代码   →   右上角切换"代码"视图 → 选择框架 → 复制/下载
```

> 💡 **提示**：加载内置模板可快速体验完整网络结构！

---

## 🗂️ 项目结构

```
nn-visual-builder/
├── src/
│   ├── components/          # React 组件
│   │   ├── NNNode.tsx            # 神经网络节点渲染
│   │   ├── ComponentPanel.tsx    # 组件库面板
│   │   ├── PropertyPanel.tsx     # 属性编辑面板
│   │   ├── TemplatePanel.tsx     # 模板库面板（含自建模块）
│   │   ├── CodePreview.tsx       # 代码预览/生成面板
│   │   └── SaveModuleModal.tsx   # 保存自建模块弹窗
│   ├── context/
│   │   └── ThemeContext.tsx      # 深/浅色主题上下文
│   ├── types/
│   │   └── index.ts              # TypeScript 类型定义
│   ├── utils/
│   │   ├── nodeConfig.ts         # 组件配置（颜色/图标/参数）
│   │   ├── codeGenerator.ts       # 多框架代码生成器
│   │   └── templates.ts          # 内置模板数据
│   ├── App.tsx               # 主应用入口
│   └── main.tsx              # React 挂载点
├── server/
│   └── index.ts              # Express API 服务器（可选）
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

---

## 🛠 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | React 18 + TypeScript |
| 构建工具 | Vite 5 |
| 样式 | Tailwind CSS 3 |
| 流程图引擎 | @xyflow/react (React Flow) |
| UI 提示 | react-hot-toast |
| 后端（可选） | Express + TypeScript |

---

## 🌍 部署

### Vercel / Netlify（推荐前端部署）

```bash
npm run build   # 构建产物在 dist/
```

将 `dist/` 目录部署即可。

### 手动服务器部署

```bash
npm install
npm run build
# 用 nginx 或类似工具托管 dist/ 目录
```

### Docker 部署

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！详情请参阅 [CONTRIBUTING.md](CONTRIBUTING.md)。

---

## 📄 License

MIT License — 详见 [LICENSE](LICENSE) 文件。
