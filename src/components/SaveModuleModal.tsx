import { useState } from 'react';
import { Node, Edge } from 'reactflow';
import { NNNodeData } from '@/types';
import { saveCustomModule, CustomModule } from '@/utils/templates';
import { v4 as uuidv4 } from 'uuid';

interface SaveModuleModalProps {
  nodes: Node<NNNodeData>[];
  edges: Edge[];
  onClose: () => void;
  onSaved: () => void;
}

const ICON_OPTIONS = ['🧩', '🔧', '🏗', '⚙️', '🔬', '🎯', '🚀', '💡', '🌐', '🔮', '🧠', '⚡'];

export default function SaveModuleModal({ nodes, edges, onClose, onSaved }: SaveModuleModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('🧩');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!name.trim()) { setError('请输入模块名称'); return; }
    if (nodes.length === 0) { setError('画布为空，无法保存'); return; }

    const mod: CustomModule = {
      id: uuidv4(),
      name: name.trim(),
      description: description.trim(),
      icon: selectedIcon,
      createdAt: new Date().toISOString(),
      nodes,
      edges,
    };

    saveCustomModule(mod);
    onSaved();
    onClose();
  };

  const inputClass = "w-full px-3 py-2 bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 focus:border-green-500 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none transition-colors";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-slate-600 w-full max-w-md shadow-2xl transition-colors"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span>💾</span> 保存为自建模块
          </h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            将当前画布（{nodes.length} 个节点）保存为可复用的自建模块
          </p>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Icon selector */}
          <div>
            <label className="text-xs text-gray-500 dark:text-slate-400 font-semibold mb-2 block">选择图标</label>
            <div className="flex flex-wrap gap-2">
              {ICON_OPTIONS.map(icon => (
                <button
                  key={icon}
                  onClick={() => setSelectedIcon(icon)}
                  className={`text-2xl p-1.5 rounded-lg transition-all ${
                    selectedIcon === icon
                      ? 'bg-green-600 ring-2 ring-green-400 scale-110'
                      : 'bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-xs text-gray-500 dark:text-slate-400 font-semibold mb-1.5 block">
              模块名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="例如：我的ResNet块"
              value={name}
              onChange={e => { setName(e.target.value); setError(''); }}
              className={inputClass}
              autoFocus
              maxLength={50}
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs text-gray-500 dark:text-slate-400 font-semibold mb-1.5 block">
              描述（可选）
            </label>
            <textarea
              placeholder="简单描述这个模块的用途..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className={`${inputClass} resize-none`}
              rows={2}
              maxLength={200}
            />
          </div>

          {/* Preview stats */}
          <div className="bg-gray-100 dark:bg-slate-700/50 rounded-lg p-3 flex gap-4 text-center">
            <div className="flex-1">
              <div className="text-xl font-bold text-blue-500 dark:text-blue-400">{nodes.length}</div>
              <div className="text-xs text-gray-500 dark:text-slate-400">节点</div>
            </div>
            <div className="w-px bg-gray-200 dark:bg-slate-600" />
            <div className="flex-1">
              <div className="text-xl font-bold text-green-500 dark:text-green-400">{edges.length}</div>
              <div className="text-xs text-gray-500 dark:text-slate-400">连接</div>
            </div>
            <div className="w-px bg-gray-200 dark:bg-slate-600" />
            <div className="flex-1">
              <div className="text-2xl">{selectedIcon}</div>
              <div className="text-xs text-gray-500 dark:text-slate-400">图标</div>
            </div>
          </div>

          {error && (
            <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700/50 rounded-lg px-3 py-2">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-200 dark:border-slate-700 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-white rounded-lg text-sm transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim() || nodes.length === 0}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-colors"
          >
            💾 保存
          </button>
        </div>
      </div>
    </div>
  );
}
