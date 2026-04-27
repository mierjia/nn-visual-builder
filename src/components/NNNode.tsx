import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { NNNodeData } from '@/types';
import { NODE_COMPONENTS } from '@/utils/nodeConfig';

function NNNode({ data, selected }: NodeProps) {
  const nodeData = data as NNNodeData;
  const config = NODE_COMPONENTS[nodeData.type];
  
  if (!config) return null;

  const formatShape = (shape: NNNodeData['inputShape']) => {
    if (!shape) return '';
    const parts = [];
    if (shape.batch !== undefined) parts.push(`B:${shape.batch}`);
    if (shape.channels !== undefined) parts.push(`C:${shape.channels}`);
    if (shape.height !== undefined) parts.push(`H:${shape.height}`);
    if (shape.width !== undefined) parts.push(`W:${shape.width}`);
    if (shape.sequence !== undefined) parts.push(`S:${shape.sequence}`);
    if (shape.features !== undefined) parts.push(`F:${shape.features}`);
    return parts.length > 0 ? `[${parts.join(', ')}]` : '';
  };

  return (
    <div className={`nn-node ${nodeData.type} ${selected ? 'ring-2 ring-white' : ''}`}>
      <Handle type="target" position={Position.Left} />
      
      <div className="flex flex-col items-center text-white min-w-[100px]">
        <span className="text-lg mb-1">{config.icon}</span>
        <span className="font-semibold text-sm">{config.labelZh}</span>
        <span className="text-xs opacity-75">{config.label}</span>
        
        {/* 输入形状 */}
        {nodeData.inputShape && Object.keys(nodeData.inputShape).length > 0 && (
          <div className="mt-2 text-xs bg-black/20 rounded px-2 py-1">
            <div className="opacity-60">IN:</div>
            <div className="font-mono">{formatShape(nodeData.inputShape)}</div>
          </div>
        )}
        
        {/* 输出形状 */}
        {nodeData.outputShape && Object.keys(nodeData.outputShape).length > 0 && (
          <div className="mt-1 text-xs bg-black/20 rounded px-2 py-1">
            <div className="opacity-60">OUT:</div>
            <div className="font-mono">{formatShape(nodeData.outputShape)}</div>
          </div>
        )}
        
        {/* 关键参数显示 */}
        {nodeData.params && Object.keys(nodeData.params).length > 0 && (
          <div className="mt-1 text-xs opacity-80">
            {Object.entries(nodeData.params)
              .slice(0, 2)
              .map(([k, v]) => (
                <div key={k}>{k}: {String(v)}</div>
              ))}
          </div>
        )}
      </div>
      
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export default memo(NNNode);
