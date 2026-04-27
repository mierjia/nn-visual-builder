# 开发指南

## 本地开发

### 环境要求
- Node.js >= 18.0.0
- npm 或 yarn

### 启动开发服务器

```bash
# 安装依赖
npm install

# 复制环境变量文件
cp .env.example .env

# 编辑 .env 文件，添加你的 CodeBuddy API Key
# CODEBUDDY_API_KEY=your_api_key_here

# 启动开发服务器
npm run dev
```

### 前端开发
前端运行在 http://localhost:5173，使用 Vite 进行热模块替换。

### 后端开发
后端运行在 http://localhost:3001，使用 tsx 进行热重载。

## 代码规范

### TypeScript
- 使用严格的 TypeScript 配置
- 避免使用 `any` 类型
- 为公共 API 编写类型定义

### React 组件
- 使用函数式组件和 hooks
- 使用 `memo` 优化渲染性能
- 组件文件使用 PascalCase 命名

### 样式
- 使用 Tailwind CSS 进行样式设计
- 遵循移动优先的设计原则

## 添加新组件

### 1. 在 nodeConfig.ts 中添加配置

```typescript
// src/utils/nodeConfig.ts
export const NODE_COMPONENTS: Record<NodeType, ComponentConfig> = {
  // ... 现有组件
  my_new_layer: {
    type: 'my_new_layer',
    label: 'MyNewLayer',
    labelZh: '我的新层',
    color: '#hexcolor',
    icon: '🔮',
    category: 'custom',  // 添加到对应分类
    params: [
      { name: 'param1', label: 'Param1', labelZh: '参数1', type: 'number', default: 64 },
    ],
    defaultParams: { param1: 64 },
    description: '这是我的新层',
  },
};
```

### 2. 在 codeGenerator.ts 中添加代码生成逻辑

```typescript
// src/utils/codeGenerator.ts
case 'my_new_layer':
  layerDefinitions.push(`self.${node.layerName} = MyLayer(${node.params.param1})`);
  forwardStatements.push(`x = self.${node.layerName}(x)`);
  break;
```

## 测试

### 运行测试
```bash
npm test
```

### 代码检查
```bash
npm run lint
```

## 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist/` 目录。

## 部署

### Docker 部署
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

### 直接部署
1. 构建项目：`npm run build`
2. 设置环境变量
3. 运行：`node server/index.js`
