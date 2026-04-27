import { Node, useReactFlow } from 'reactflow';
import { useCallback, useEffect, useState } from 'react';
import { NNNodeData, TensorShape } from '@/types';
import { NODE_COMPONENTS, ParamConfig } from '@/utils/nodeConfig';

interface PropertyPanelProps {
  selectedNode: Node<NNNodeData> | null;
  onClose: () => void;
}

export default function PropertyPanel({ selectedNode, onClose }: PropertyPanelProps) {
  const { setNodes } = useReactFlow();
  const [localParams, setLocalParams] = useState<Record<string, any>>({});
  const [localLabel, setLocalLabel] = useState('');
  const [inputShape, setInputShape] = useState<TensorShape>({});
  const [outputShape, setOutputShape] = useState<TensorShape>({});

  useEffect(() => {
    if (selectedNode) {
      setLocalParams(selectedNode.data.params || {});
      setLocalLabel(selectedNode.data.label || '');
      setInputShape(selectedNode.data.inputShape || {});
      setOutputShape(selectedNode.data.outputShape || {});
    }
  }, [selectedNode]);

  const updateNode = useCallback(
    (updates: Partial<NNNodeData>) => {
      if (!selectedNode) return;
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedNode.id) {
            return {
              ...node,
              data: { ...node.data, ...updates },
            };
          }
          return node;
        })
      );
    },
    [selectedNode, setNodes]
  );

  const handleParamChange = (name: string, value: any) => {
    const newParams = { ...localParams, [name]: value };
    setLocalParams(newParams);
    updateNode({ params: newParams });
  };

  const handleShapeChange = (
    type: 'input' | 'output',
    key: keyof TensorShape,
    value: number | undefined
  ) => {
    const newShape = type === 'input'
      ? { ...inputShape, [key]: value }
      : { ...outputShape, [key]: value };

    if (type === 'input') {
      setInputShape(newShape);
      updateNode({ inputShape: newShape });
    } else {
      setOutputShape(newShape);
      updateNode({ outputShape: newShape });
    }
  };

  const panelBase = "w-72 bg-white dark:bg-slate-800 text-gray-900 dark:text-white h-full flex flex-col border-l border-gray-200 dark:border-slate-700 transition-colors duration-200";
  const sectionBorder = "border-b border-gray-200 dark:border-slate-700";
  const labelMuted = "text-xs text-gray-500 dark:text-slate-400";
  const inputClass = "w-full px-3 py-1.5 bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors";

  if (!selectedNode) {
    return (
      <div className={`${panelBase} items-center justify-center`}>
        <p className="text-gray-400 dark:text-slate-400">👈 选择一个节点来编辑属性</p>
      </div>
    );
  }

  const config = NODE_COMPONENTS[selectedNode.data.type];
  if (!config) return null;

  return (
    <div className={`${panelBase} overflow-y-auto`}>
      {/* 头部 */}
      <div className={`p-4 ${sectionBorder} flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <span className="text-xl">{config.icon}</span>
          <div>
            <h3 className="font-semibold">{config.labelZh}</h3>
            <p className={`text-xs ${labelMuted}`}>{config.label}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      {/* 描述 */}
      <div className={`p-4 ${sectionBorder}`}>
        <p className="text-sm text-gray-600 dark:text-slate-300">{config.description}</p>
      </div>

      {/* 参数配置 */}
      <div className={`p-4 ${sectionBorder}`}>
        <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">⚙️ 参数配置</h4>
        <div className="space-y-3">
          {config.params.map((param) => (
            <ParamInput
              key={param.name}
              config={param}
              value={localParams[param.name]}
              onChange={(v) => handleParamChange(param.name, v)}
            />
          ))}
        </div>
      </div>

      {/* 输入形状 */}
      <div className={`p-4 ${sectionBorder}`}>
        <h4 className="font-semibold text-sm mb-3">📥 输入形状</h4>
        <div className="space-y-3">
          {(['batch','channels','height','width','sequence','features'] as (keyof TensorShape)[]).map(k => (
            <ShapeInput
              key={k}
              label={shapeLabel[k][0]}
              labelZh={shapeLabel[k][1]}
              value={inputShape[k]}
              onChange={(v) => handleShapeChange('input', k, v)}
            />
          ))}
        </div>
      </div>

      {/* 输出形状 */}
      <div className={`p-4 ${sectionBorder}`}>
        <h4 className="font-semibold text-sm mb-3">📤 输出形状</h4>
        <div className="space-y-3">
          {(['batch','channels','height','width','sequence','features'] as (keyof TensorShape)[]).map(k => (
            <ShapeInput
              key={k}
              label={shapeLabel[k][0]}
              labelZh={shapeLabel[k][1]}
              value={outputShape[k]}
              onChange={(v) => handleShapeChange('output', k, v)}
            />
          ))}
        </div>
      </div>

      {/* 删除按钮 */}
      <div className="p-4 mt-auto">
        <button
          onClick={() => {
            setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
            onClose();
          }}
          className="w-full py-2 bg-red-600 hover:bg-red-500 rounded font-medium transition-colors text-white"
        >
          🗑 删除节点
        </button>
      </div>
    </div>
  );
}

const shapeLabel: Record<string, [string, string]> = {
  batch: ['B', '批次大小'],
  channels: ['C', '通道数'],
  height: ['H', '高度'],
  width: ['W', '宽度'],
  sequence: ['S', '序列长度'],
  features: ['F', '特征数'],
};

interface ParamInputProps {
  config: ParamConfig;
  value: any;
  onChange: (value: any) => void;
}

function ParamInput({ config, value, onChange }: ParamInputProps) {
  const currentValue = value !== undefined ? value : config.default;
  const inputClass = "w-full px-3 py-1.5 bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors";

  return (
    <div className="space-y-1">
      <label className="text-xs text-gray-500 dark:text-slate-400">
        {config.labelZh} ({config.label})
      </label>
      {config.type === 'number' && (
        <input
          type="number"
          value={currentValue}
          min={config.min}
          max={config.max}
          step={config.step || 1}
          onChange={(e) => onChange(Number(e.target.value))}
          className={inputClass}
        />
      )}
      {config.type === 'string' && (
        <input
          type="text"
          value={currentValue}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        />
      )}
      {config.type === 'boolean' && (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={currentValue}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 rounded bg-gray-100 dark:bg-slate-700"
          />
          <span className="text-sm">{currentValue ? '是' : '否'}</span>
        </label>
      )}
      {config.type === 'select' && (
        <select
          value={currentValue}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        >
          {config.options?.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )}
    </div>
  );
}

interface ShapeInputProps {
  label: string;
  labelZh: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
}

function ShapeInput({ label, labelZh, value, onChange }: ShapeInputProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 dark:text-slate-400 w-12">
        {label} ({labelZh})
      </span>
      <input
        type="number"
        value={value ?? ''}
        placeholder="-"
        min={1}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
        className="flex-1 px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      />
    </div>
  );
}
