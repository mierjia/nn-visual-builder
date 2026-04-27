import { useState } from 'react';
import { NODE_COMPONENTS, CATEGORIES, getComponentsByCategory, ComponentConfig } from '@/utils/nodeConfig';
import { NodeType } from '@/types';

interface ComponentPanelProps {
  onDragStart: (type: NodeType) => void;
}

export default function ComponentPanel({ onDragStart }: ComponentPanelProps) {
  const [activeCategory, setActiveCategory] = useState('input');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredComponents = getComponentsByCategory(activeCategory).filter(
    (c) =>
      c.labelZh.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-64 bg-white dark:bg-slate-800 text-gray-900 dark:text-white h-full flex flex-col border-r border-gray-200 dark:border-slate-700 transition-colors duration-200">
      {/* 标题 */}
      <div className="p-4 border-b border-gray-200 dark:border-slate-700">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span>🧠</span> 神经网络组件
        </h2>
      </div>

      {/* 搜索框 */}
      <div className="p-3 border-b border-gray-200 dark:border-slate-700">
        <input
          type="text"
          placeholder="搜索组件..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />
      </div>

      {/* 分类标签 */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 dark:border-slate-700 overflow-x-auto">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-2 py-1 text-xs rounded transition-colors whitespace-nowrap ${
              activeCategory === cat.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
            }`}
          >
            {cat.labelZh}
          </button>
        ))}
      </div>

      {/* 组件列表 */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-2 gap-2">
          {filteredComponents.map((comp) => (
            <ComponentItem
              key={comp.type}
              config={comp}
              onDragStart={onDragStart}
            />
          ))}
        </div>
      </div>

      {/* 使用说明 */}
      <div className="p-3 border-t border-gray-200 dark:border-slate-700 text-xs text-gray-500 dark:text-slate-400">
        <p>💡 拖拽组件到画布</p>
        <p>💡 连接箭头表示数据流</p>
        <p>💡 点击节点编辑属性</p>
      </div>
    </div>
  );
}

interface ComponentItemProps {
  config: ComponentConfig;
  onDragStart: (type: NodeType) => void;
}

function ComponentItem({ config, onDragStart }: ComponentItemProps) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('application/reactflow', config.type);
        e.dataTransfer.effectAllowed = 'move';
        onDragStart(config.type);
      }}
      className="shape-btn p-3 rounded-lg cursor-grab active:cursor-grabbing transition-all flex flex-col items-center gap-1 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 border border-gray-200 dark:border-slate-600"
    >
      <span className="text-2xl">{config.icon}</span>
      <span className="text-xs font-medium text-center text-gray-800 dark:text-white">{config.labelZh}</span>
      <span className="text-[10px] text-gray-500 dark:text-slate-400">{config.label}</span>
    </div>
  );
}
