import { useState } from 'react';
import { Node, Edge } from 'reactflow';
import { NNNodeData } from '@/types';
import {
  BUILT_IN_TEMPLATES,
  TEMPLATE_CATEGORIES,
  NetworkTemplate,
  CustomModule,
  loadCustomModules,
  deleteCustomModule,
} from '@/utils/templates';

interface TemplatePanelProps {
  onLoadTemplate: (nodes: Node<NNNodeData>[], edges: Edge[]) => void;
  onSaveModule: () => void;
}

export default function TemplatePanel({ onLoadTemplate, onSaveModule }: TemplatePanelProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState<NetworkTemplate | null>(null);
  const [customModules, setCustomModules] = useState<CustomModule[]>(() => loadCustomModules());
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const refreshCustomModules = () => setCustomModules(loadCustomModules());

  const filteredTemplates = BUILT_IN_TEMPLATES.filter(t => {
    const matchCat = activeCategory === 'all' || t.category === activeCategory;
    const matchSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const filteredCustom = customModules.filter(m => {
    const matchCat = activeCategory === 'all' || activeCategory === 'custom';
    const matchSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleLoad = (nodes: Node<NNNodeData>[], edges: Edge[]) => {
    const idMap = new Map<string, string>();
    const newNodes = nodes.map(n => {
      const newId = `${n.id}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      idMap.set(n.id, newId);
      return { ...n, id: newId };
    });
    const newEdges = edges.map(e => ({
      ...e,
      id: `${e.id}_${Date.now()}`,
      source: idMap.get(e.source) || e.source,
      target: idMap.get(e.target) || e.target,
    }));
    onLoadTemplate(newNodes, newEdges);
    setPreviewTemplate(null);
  };

  const handleDeleteCustom = (id: string) => {
    deleteCustomModule(id);
    refreshCustomModules();
    setConfirmDeleteId(null);
  };

  const categoryCount = (key: string) => {
    if (key === 'all') return BUILT_IN_TEMPLATES.length + customModules.length;
    if (key === 'custom') return customModules.length;
    return BUILT_IN_TEMPLATES.filter(t => t.category === key).length;
  };

  return (
    <div className="w-72 bg-white dark:bg-slate-800 text-gray-900 dark:text-white h-full flex flex-col border-r border-gray-200 dark:border-slate-700 transition-colors duration-200">
      {/* 标题 */}
      <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
        <h2 className="text-base font-bold flex items-center gap-2">
          <span>📐</span> 模板库
        </h2>
        <button
          onClick={() => { onSaveModule(); setTimeout(refreshCustomModules, 300); }}
          className="flex items-center gap-1 px-2 py-1 bg-green-600 hover:bg-green-500 rounded text-xs font-medium text-white transition-colors"
          title="将当前画布保存为自建模块"
        >
          <span>💾</span> 保存当前
        </button>
      </div>

      {/* 搜索 */}
      <div className="p-3 border-b border-gray-200 dark:border-slate-700">
        <input
          type="text"
          placeholder="搜索模板..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
        />
      </div>

      {/* 分类 */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 dark:border-slate-700">
        {TEMPLATE_CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors whitespace-nowrap ${
              activeCategory === cat.key
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
            <span className="text-[10px] opacity-60">({categoryCount(cat.key)})</span>
          </button>
        ))}
      </div>

      {/* 模板列表 */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredTemplates.length > 0 && (
          <>
            {activeCategory !== 'custom' && (
              <div className="text-xs text-gray-500 dark:text-slate-400 font-semibold uppercase tracking-wider mb-2">
                内置模板 ({filteredTemplates.length})
              </div>
            )}
            {activeCategory !== 'custom' && filteredTemplates.map(t => (
              <TemplateCard
                key={t.id}
                template={t}
                onPreview={() => setPreviewTemplate(t)}
                onLoad={() => handleLoad(t.nodes, t.edges)}
              />
            ))}
          </>
        )}

        {(activeCategory === 'all' || activeCategory === 'custom') && filteredCustom.length > 0 && (
          <>
            <div className="text-xs text-gray-500 dark:text-slate-400 font-semibold uppercase tracking-wider mt-3 mb-2">
              自建模块 ({filteredCustom.length})
            </div>
            {filteredCustom.map(m => (
              <CustomModuleCard
                key={m.id}
                module={m}
                onLoad={() => handleLoad(m.nodes, m.edges)}
                onDelete={() => setConfirmDeleteId(m.id)}
                showConfirm={confirmDeleteId === m.id}
                onConfirmDelete={() => handleDeleteCustom(m.id)}
                onCancelDelete={() => setConfirmDeleteId(null)}
              />
            ))}
          </>
        )}

        {filteredTemplates.length === 0 && filteredCustom.length === 0 && (
          <div className="text-center text-gray-400 dark:text-slate-400 text-sm py-8">
            <div className="text-3xl mb-2">🔍</div>
            <p>没有找到匹配的模板</p>
          </div>
        )}
      </div>

      {/* 使用说明 */}
      <div className="p-3 border-t border-gray-200 dark:border-slate-700 text-xs text-gray-500 dark:text-slate-400 space-y-1">
        <p>💡 点击"加载"将模板添加到画布</p>
        <p>💡 点击"保存当前"可保存自建模块</p>
      </div>

      {/* 预览弹窗 */}
      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onLoad={() => handleLoad(previewTemplate.nodes, previewTemplate.edges)}
        />
      )}
    </div>
  );
}

// ─── Template Card ───────────────────────────
interface TemplateCardProps {
  template: NetworkTemplate;
  onPreview: () => void;
  onLoad: () => void;
}

function TemplateCard({ template, onPreview, onLoad }: TemplateCardProps) {
  return (
    <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3 border border-gray-200 dark:border-slate-600 hover:border-purple-400 dark:hover:border-purple-500 transition-all group">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-2xl shrink-0">{template.icon}</span>
          <div className="min-w-0">
            <div className="font-semibold text-sm truncate text-gray-900 dark:text-white">{template.name}</div>
            <div className="text-xs text-gray-500 dark:text-slate-400 line-clamp-2 mt-0.5">{template.description}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mt-2">
        {template.tags.slice(0, 3).map(tag => (
          <span key={tag} className="px-1.5 py-0.5 bg-gray-200 dark:bg-slate-600 text-[10px] rounded text-gray-600 dark:text-slate-300">
            {tag}
          </span>
        ))}
      </div>

      <div className="text-[10px] text-gray-400 dark:text-slate-500 mt-1.5">
        {template.nodes.length} 个节点 · {template.edges.length} 条连接
      </div>

      <div className="flex gap-1.5 mt-2">
        <button
          onClick={onPreview}
          className="flex-1 px-2 py-1 bg-gray-200 dark:bg-slate-600 hover:bg-gray-300 dark:hover:bg-slate-500 text-gray-700 dark:text-white rounded text-xs transition-colors"
        >
          👁 预览
        </button>
        <button
          onClick={onLoad}
          className="flex-1 px-2 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs transition-colors font-medium"
        >
          ⬇ 加载
        </button>
      </div>
    </div>
  );
}

// ─── Custom Module Card ───────────────────────
interface CustomModuleCardProps {
  module: CustomModule;
  onLoad: () => void;
  onDelete: () => void;
  showConfirm: boolean;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}

function CustomModuleCard({ module, onLoad, onDelete, showConfirm, onConfirmDelete, onCancelDelete }: CustomModuleCardProps) {
  return (
    <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3 border border-gray-200 dark:border-slate-600 hover:border-green-400 dark:hover:border-green-500 transition-all">
      <div className="flex items-start gap-2">
        <span className="text-2xl shrink-0">{module.icon || '🧩'}</span>
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-sm truncate text-gray-900 dark:text-white">{module.name}</div>
          <div className="text-xs text-gray-500 dark:text-slate-400 line-clamp-2 mt-0.5">{module.description || '用户自建模块'}</div>
          <div className="text-[10px] text-gray-400 dark:text-slate-500 mt-1">
            {module.nodes.length} 个节点 · 创建于 {new Date(module.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {showConfirm ? (
        <div className="flex gap-1.5 mt-2">
          <span className="text-xs text-red-500 flex-1">确认删除？</span>
          <button onClick={onConfirmDelete} className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-xs">删除</button>
          <button onClick={onCancelDelete} className="px-2 py-1 bg-gray-200 dark:bg-slate-600 hover:bg-gray-300 dark:hover:bg-slate-500 rounded text-xs text-gray-700 dark:text-white">取消</button>
        </div>
      ) : (
        <div className="flex gap-1.5 mt-2">
          <button
            onClick={onLoad}
            className="flex-1 px-2 py-1 bg-green-600 hover:bg-green-500 text-white rounded text-xs transition-colors font-medium"
          >
            ⬇ 加载
          </button>
          <button
            onClick={onDelete}
            className="px-2 py-1 bg-gray-200 dark:bg-slate-600 hover:bg-red-600 hover:text-white text-gray-700 dark:text-white rounded text-xs transition-colors"
            title="删除"
          >
            🗑
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Preview Modal ─────────────────────────────
interface TemplatePreviewModalProps {
  template: NetworkTemplate;
  onClose: () => void;
  onLoad: () => void;
}

function TemplatePreviewModal({ template, onClose, onLoad }: TemplatePreviewModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-600 w-full max-w-lg shadow-2xl transition-colors"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{template.icon}</span>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{template.name}</h3>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">{template.description}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div>
            <div className="text-xs text-gray-500 dark:text-slate-400 mb-2 font-semibold">标签</div>
            <div className="flex flex-wrap gap-1.5">
              {template.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/60 border border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 text-xs rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-100 dark:bg-slate-700 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-500 dark:text-blue-400">{template.nodes.length}</div>
              <div className="text-xs text-gray-500 dark:text-slate-400">节点</div>
            </div>
            <div className="bg-gray-100 dark:bg-slate-700 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-500 dark:text-green-400">{template.edges.length}</div>
              <div className="text-xs text-gray-500 dark:text-slate-400">连接</div>
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500 dark:text-slate-400 mb-2 font-semibold">网络层（前8个）</div>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {template.nodes.slice(0, 8).map((n, i) => (
                <div key={n.id} className="flex items-center gap-2 text-xs">
                  <span className="text-gray-400 dark:text-slate-500 w-4 text-right">{i + 1}.</span>
                  <span className="text-gray-900 dark:text-white font-medium">{n.data.label}</span>
                  <span className="text-gray-500 dark:text-slate-400">({n.data.type})</span>
                </div>
              ))}
              {template.nodes.length > 8 && (
                <div className="text-xs text-gray-400 dark:text-slate-500 text-center pt-1">
                  ... 还有 {template.nodes.length - 8} 个节点
                </div>
              )}
            </div>
          </div>
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
            onClick={onLoad}
            className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            ⬇ 加载到画布
          </button>
        </div>
      </div>
    </div>
  );
}
