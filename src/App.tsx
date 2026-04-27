import { useCallback, useState, useRef, useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  addEdge,
  Connection,
  Edge,
  Node,
  useNodesState,
  useEdgesState,
  NodeTypes,
  Panel,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { v4 as uuidv4 } from 'uuid';
import toast, { Toaster } from 'react-hot-toast';

import NNNode from '@/components/NNNode';
import ComponentPanel from '@/components/ComponentPanel';
import PropertyPanel from '@/components/PropertyPanel';
import CodePreview from '@/components/CodePreview';
import TemplatePanel from '@/components/TemplatePanel';
import SaveModuleModal from '@/components/SaveModuleModal';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { NODE_COMPONENTS } from '@/utils/nodeConfig';
import { NodeType, NNNodeData, TensorShape } from '@/types';

// 形状兼容性检查函数
function checkShapeCompatibility(sourceShape: TensorShape, targetShape: TensorShape): { compatible: boolean; message: string } {
  // 如果目标节点没有设置输入形状，视为兼容
  if (!targetShape || Object.keys(targetShape).length === 0) {
    return { compatible: true, message: '' };
  }
  
  // 如果源节点没有输出形状，视为兼容
  if (!sourceShape || Object.keys(sourceShape).length === 0) {
    return { compatible: true, message: '' };
  }
  
  // 检查关键维度兼容性
  const sourceKeys = Object.keys(sourceShape).filter(k => k !== 'batch');
  const targetKeys = Object.keys(targetShape).filter(k => k !== 'batch');
  
  // 检查维度数量是否匹配
  if (sourceKeys.length !== targetKeys.length) {
    return {
      compatible: false,
      message: `维度数量不匹配: 源输出 ${sourceKeys.length}维，目标输入 ${targetKeys.length}维`
    };
  }
  
  // 检查各维度是否兼容（-1 表示自动推断）
  for (const key of sourceKeys) {
    const sourceVal = sourceShape[key as keyof TensorShape];
    const targetVal = targetShape[key as keyof TensorShape];
    
    if (targetVal !== undefined && targetVal !== -1 && sourceVal !== -1 && sourceVal !== targetVal) {
      return {
        compatible: false,
        message: `维度 ${key} 不匹配: 源输出 ${sourceVal}，目标输入 ${targetVal}`
      };
    }
  }
  
  return { compatible: true, message: '' };
}

// 格式化形状为字符串
function formatShape(shape: TensorShape): string {
  if (!shape || Object.keys(shape).length === 0) return '未设置';
  const parts: string[] = [];
  if (shape.batch !== undefined) parts.push(`B:${shape.batch}`);
  if (shape.channels !== undefined) parts.push(`C:${shape.channels}`);
  if (shape.height !== undefined) parts.push(`H:${shape.height}`);
  if (shape.width !== undefined) parts.push(`W:${shape.width}`);
  if (shape.sequence !== undefined) parts.push(`S:${shape.sequence}`);
  if (shape.features !== undefined) parts.push(`F:${shape.features}`);
  return parts.length > 0 ? `[${parts.join(', ')}]` : '未设置';
}

const nodeTypes: NodeTypes = {
  nnNode: NNNode,
};

type ViewMode = 'canvas' | 'code';
type SidePanel = 'components' | 'templates';

function FlowApp() {
  const { isDark, toggleTheme, theme } = useTheme();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node<NNNodeData> | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('canvas');
  const [sidePanel, setSidePanel] = useState<SidePanel>('components');
  const [, setDraggedType] = useState<NodeType | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // 计算输出形状（简化版）
  const computeOutputShape = useCallback((type: NodeType, inputShape: any, params: any) => {
    const output = { ...inputShape };
    
    switch (type) {
      case 'conv2d':
        if (output.height && output.width) {
          output.height = Math.floor((output.height + 2 * params.padding - params.dilation * (params.kernel_size - 1) - 1) / params.stride + 1);
          output.width = Math.floor((output.width + 2 * params.padding - params.dilation * (params.kernel_size - 1) - 1) / params.stride + 1);
        }
        if (output.channels !== undefined) {
          output.channels = params.out_channels;
        }
        break;
      case 'maxpool':
      case 'avgpool':
        if (output.height && output.width) {
          output.height = Math.floor((output.height - params.kernel_size) / params.stride + 1);
          output.width = Math.floor((output.width - params.kernel_size) / params.stride + 1);
        }
        break;
      case 'fc':
        if (output.features !== undefined) {
          output.features = params.out_features;
        } else if (output.channels !== undefined) {
          output.features = params.out_features;
          delete output.channels;
          delete output.height;
          delete output.width;
        }
        break;
      case 'flatten':
        if (output.channels !== undefined && output.height !== undefined && output.width !== undefined) {
          output.features = output.channels * output.height * output.width;
          delete output.channels;
          delete output.height;
          delete output.width;
        }
        break;
      case 'reshape':
        // 用户指定目标形状
        break;
      case 'transpose':
        // 简单处理
        break;
      default:
        break;
    }
    
    return output;
  }, []);

  // 添加新节点
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow') as NodeType;
      if (!type || !reactFlowWrapper.current) return;

      const config = NODE_COMPONENTS[type];
      if (!config) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left - 100,
        y: event.clientY - reactFlowBounds.top - 40,
      };

      // 计算默认输入输出形状
      const inputShape: any = {};
      const defaultOutputShape = computeOutputShape(type, inputShape, config.defaultParams);

      const newNode: Node<NNNodeData> = {
        id: uuidv4(),
        type: 'nnNode',
        position,
        data: {
          label: config.label,
          type,
          params: { ...config.defaultParams },
          inputShape,
          outputShape: defaultOutputShape,
        },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes, computeOutputShape]
  );

  // 连接节点
  const onConnect = useCallback(
    (params: Connection) => {
      // 验证形状兼容性
      if (params.target && params.source) {
        const sourceNode = nodes.find((n) => n.id === params.source);
        const targetNode = nodes.find((n) => n.id === params.target);
        
        if (sourceNode && targetNode) {
          const targetConfig = NODE_COMPONENTS[targetNode.data.type];
          
          // 如果目标节点需要特定输入形状（不是 input 层且设置了输入形状）
          if (targetNode.data.type !== 'input' && Object.keys(targetNode.data.inputShape || {}).length > 0) {
            const { compatible, message } = checkShapeCompatibility(
              sourceNode.data.outputShape || {},
              targetNode.data.inputShape || {}
            );
            
            if (!compatible) {
              toast.error(`❌ 形状不兼容！${message}\n源: ${formatShape(sourceNode.data.outputShape)} → 目标: ${formatShape(targetNode.data.inputShape)}`, {
                duration: 4000,
                style: {
                  background: '#ef4444',
                  color: '#fff',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  maxWidth: '400px',
                },
              });
              return; // 阻止连接
            }
          }
          
          // 形状兼容，自动更新目标节点形状
          setNodes((nds) =>
            nds.map((node) => {
              if (node.id === params.target) {
                const outputShape = computeOutputShape(
                  node.data.type,
                  sourceNode.data.outputShape || {},
                  node.data.params
                );
                return {
                  ...node,
                  data: {
                    ...node.data,
                    inputShape: sourceNode.data.outputShape || {},
                    outputShape,
                  },
                };
              }
              return node;
            })
          );
          
          // 显示成功提示
          toast.success(`✅ 连接成功: ${formatShape(sourceNode.data.outputShape)}`, {
            duration: 2000,
            icon: '→',
          });
        }
      }
      
      // 创建边
      const newEdges = addEdge(
        {
          ...params,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#94a3b8', strokeWidth: 2 },
        },
        edges
      );
      setEdges(newEdges);
    },
    [edges, setEdges, nodes, setNodes, computeOutputShape]
  );

  // 选择节点
  const onNodeClick = useCallback((_: any, node: Node<NNNodeData>) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // 删除选中的边
  const onEdgesDelete = useCallback(
    (edgesToDelete: Edge[]) => {
      setEdges((eds) => eds.filter((e) => !edgesToDelete.some((d) => d.id === e.id)));
    },
    [setEdges]
  );

  // 清除画布
  const handleClear = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
  }, [setNodes, setEdges]);

  // 加载模板：追加到当前画布
  const handleLoadTemplate = useCallback((templateNodes: Node<NNNodeData>[], templateEdges: Edge[]) => {
    // 偏移量：放在现有节点的右侧
    const offsetX = nodes.length > 0 ? Math.max(...nodes.map(n => n.position.x)) + 200 : 0;
    const shiftedNodes = templateNodes.map(n => ({
      ...n,
      position: { x: n.position.x + offsetX, y: n.position.y },
    }));
    setNodes(prev => [...prev, ...shiftedNodes]);
    setEdges(prev => [...prev, ...templateEdges]);
    toast.success(`✅ 模板已加载到画布（${templateNodes.length} 个节点）`, { duration: 2000 });
  }, [nodes, setNodes, setEdges]);

  return (
    <div className="flex h-screen w-screen bg-gray-100 dark:bg-slate-900 transition-colors duration-200">
      {/* 左侧面板：侧边栏切换按钮 + 内容 */}
      {viewMode === 'canvas' && (
        <div className="flex">
          {/* 侧边栏标签切换（竖向 tab） */}
          <div className="flex flex-col bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 w-12 items-center pt-3 gap-2">
            <button
              onClick={() => setSidePanel('components')}
              title="组件库"
              className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-colors ${
                sidePanel === 'components'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              🧱
            </button>
            <button
              onClick={() => setSidePanel('templates')}
              title="模板库"
              className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-colors ${
                sidePanel === 'templates'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              📐
            </button>
          </div>

          {/* 实际内容面板 */}
          {sidePanel === 'components' ? (
            <ComponentPanel onDragStart={setDraggedType} />
          ) : (
            <TemplatePanel
              onLoadTemplate={handleLoadTemplate}
              onSaveModule={() => setShowSaveModal(true)}
            />
          )}
        </div>
      )}

      {/* 主画布 */}
      <div className="flex-1 flex flex-col">
        {/* 工具栏 */}
        <div className="h-14 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between px-4 transition-colors duration-200">
          <div className="flex items-center gap-4">
            <h1 className="text-gray-900 dark:text-white font-bold text-lg flex items-center gap-2">
              🧠 神经网络可视化搭建器
            </h1>
            <span className="text-gray-500 dark:text-slate-400 text-sm">
              拖拽组件 · 连接数据流 · 生成代码
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            {/* 视图切换 */}
            <div className="flex bg-gray-100 dark:bg-slate-700 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('canvas')}
                className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                  viewMode === 'canvas'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
              >
                🎨 画布
              </button>
              <button
                onClick={() => setViewMode('code')}
                className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                  viewMode === 'code'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
              >
                💻 代码
              </button>
            </div>

            {/* 保存自建模块快捷按钮 */}
            <button
              onClick={() => setShowSaveModal(true)}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-500 rounded text-sm text-white transition-colors flex items-center gap-1"
              title="保存为自建模块"
            >
              💾 保存模块
            </button>

            <button
              onClick={handleClear}
              className="px-4 py-1.5 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-700 dark:text-white rounded text-sm transition-colors"
            >
              🗑 清空
            </button>

            {/* 深浅色切换按钮 */}
            <button
              onClick={toggleTheme}
              title={isDark ? '切换到浅色模式' : '切换到深色模式'}
              className="w-9 h-9 rounded-lg flex items-center justify-center bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-700 dark:text-white transition-colors text-base"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 flex overflow-hidden">
          {viewMode === 'canvas' ? (
            <>
              {/* React Flow 画布 */}
              <div ref={reactFlowWrapper} className="flex-1 relative">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  onNodeClick={onNodeClick}
                  onPaneClick={onPaneClick}
                  onEdgesDelete={onEdgesDelete}
                  nodeTypes={nodeTypes}
                  fitView
                  snapToGrid
                  snapGrid={[15, 15]}
                  defaultEdgeOptions={{
                    type: 'smoothstep',
                    animated: true,
                  }}
                >
                  <Controls className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 [&>button]:text-gray-700 dark:[&>button]:text-white [&>button]:bg-white dark:[&>button]:bg-slate-800 [&>button:hover]:bg-gray-100 dark:[&>button:hover]:bg-slate-700" />
                  <Background color={isDark ? '#475569' : '#cbd5e1'} gap={15} />
                  <MiniMap
                    className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700"
                    nodeColor={(node) => {
                      const config = NODE_COMPONENTS[(node.data as NNNodeData).type];
                      return config?.color || '#64748b';
                    }}
                    maskColor={isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.7)'}
                  />
                  
                  {/* 帮助信息 */}
                  <Panel position="top-left" className="bg-white/90 dark:bg-slate-800/90 p-3 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm">
                    <div className="text-xs text-gray-600 dark:text-slate-300 space-y-1">
                      <p>🧱 左侧 = 组件库 | 📐 左侧 = 模板库</p>
                      <p>💡 拖拽组件到画布 | 点击节点编辑</p>
                      <p>💡 从节点端口拖拽创建连线</p>
                    </div>
                  </Panel>
                </ReactFlow>
              </div>

              {/* 右侧属性面板 */}
              <PropertyPanel
                selectedNode={selectedNode}
                onClose={() => setSelectedNode(null)}
              />
            </>
          ) : (
            /* 代码预览视图 */
            <CodePreview nodes={nodes} edges={edges} />
          )}
        </div>
      </div>

      {/* 保存自建模块弹窗 */}
      {showSaveModal && (
        <SaveModuleModal
          nodes={nodes}
          edges={edges}
          onClose={() => setShowSaveModal(false)}
          onSaved={() => toast.success('✅ 模块已保存！可在模板库 → 自建模块中找到', { duration: 3000 })}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ReactFlowProvider>
        <Toaster position="top-center" />
        <FlowApp />
      </ReactFlowProvider>
    </ThemeProvider>
  );
}
