# 贡献指南

感谢您对神经网络可视化搭建器的兴趣！🎉

## 如何贡献

### 🐛 报告 Bug

请通过 GitHub Issues 报告 Bug，包含以下信息：
- 问题描述
- 复现步骤
- 预期行为 vs 实际行为
- 环境信息（浏览器、Node.js 版本等）

### 💡 提出功能建议

欢迎提出新功能建议！请通过 GitHub Discussions 或 Issues 描述：
- 功能目标
- 使用场景
- 可能的实现思路

### 🔧 提交代码

1. **Fork 本仓库**
2. **创建特性分支**：
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **编写代码**，遵守以下规范：
   - 使用 TypeScript，严格类型
   - 组件使用函数式组件 + hooks
   - 使用 Tailwind CSS 编写样式
   - 避免 `any` 类型
4. **提交前测试**
   ```bash
   npm run build   # 确保能正常构建
   ```
5. **提交 Pull Request**，描述改动内容

## 开发规范

### 添加新神经网络组件

**步骤 1**：在 `src/utils/nodeConfig.ts` 中添加配置：

```typescript
my_new_layer: {
  type: 'my_new_layer',
  label: 'MyNewLayer',
  labelZh: '我的新层',
  color: '#hexcolor',
  icon: '🔮',
  category: 'custom',
  params: [
    { name: 'param1', label: 'Param1', labelZh: '参数1', type: 'number', default: 64 },
  ],
  defaultParams: { param1: 64 },
  description: '这是我的新层',
},
```

**步骤 2**：在 `src/utils/codeGenerator.ts` 中添加代码生成逻辑：

```typescript
case 'my_new_layer':
  layerDefinitions.push(`self.${node.layerName} = MyLayer(${node.params.param1})`);
  forwardStatements.push(`x = self.${node.layerName}(x)`);
  break;
```

### 主题支持

所有新组件必须同时支持深色和浅色模式：

```tsx
<div className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white">
  {/* 内容 */}
</div>
```

## 代码审查

所有 Pull Request 需要经过审查才能合并。请确保：
- ✅ 代码通过 TypeScript 类型检查
- ✅ `npm run build` 成功
- ✅ 新功能有适当的文档说明
