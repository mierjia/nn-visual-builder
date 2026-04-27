import { NodeType } from '@/types';

export interface ComponentConfig {
  type: NodeType;
  label: string;
  labelZh: string;
  color: string;
  icon: string;
  category: 'input' | 'conv' | 'pool' | 'fc' | 'activation' | 'norm' | 'transformer' | 'rnn' | 'reshape' | 'utility';
  params: ParamConfig[];
  defaultParams: Record<string, any>;
  description: string;
}

export interface ParamConfig {
  name: string;
  label: string;
  labelZh: string;
  type: 'number' | 'string' | 'select' | 'boolean';
  default: any;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
}

export const NODE_COMPONENTS: Record<NodeType, ComponentConfig> = {
  input: {
    type: 'input',
    label: 'Input',
    labelZh: '输入层',
    color: '#22c55e',
    icon: '📥',
    category: 'input',
    params: [
      { name: 'channels', label: 'Channels', labelZh: '通道数', type: 'number', default: 3, min: 1, max: 1024 },
      { name: 'height', label: 'Height', labelZh: '高度', type: 'number', default: 224, min: 1, max: 1024 },
      { name: 'width', label: 'Width', labelZh: '宽度', type: 'number', default: 224, min: 1, max: 1024 },
    ],
    defaultParams: { channels: 3, height: 224, width: 224 },
    description: '定义网络输入数据的形状',
  },
  output: {
    type: 'output',
    label: 'Output',
    labelZh: '输出层',
    color: '#ef4444',
    icon: '📤',
    category: 'utility',
    params: [
      { name: 'features', label: 'Features', labelZh: '特征数', type: 'number', default: 1000, min: 1, max: 100000 },
    ],
    defaultParams: { features: 1000 },
    description: '定义网络输出',
  },
  conv2d: {
    type: 'conv2d',
    label: 'Conv2D',
    labelZh: '二维卷积',
    color: '#3b82f6',
    icon: '🔲',
    category: 'conv',
    params: [
      { name: 'out_channels', label: 'Out Channels', labelZh: '输出通道', type: 'number', default: 64, min: 1, max: 4096 },
      { name: 'kernel_size', label: 'Kernel Size', labelZh: '卷积核大小', type: 'number', default: 3, min: 1, max: 31 },
      { name: 'stride', label: 'Stride', labelZh: '步长', type: 'number', default: 1, min: 1, max: 16 },
      { name: 'padding', label: 'Padding', labelZh: '填充', type: 'number', default: 1, min: 0, max: 16 },
      { name: 'dilation', label: 'Dilation', labelZh: '膨胀率', type: 'number', default: 1, min: 1, max: 16 },
      { name: 'groups', label: 'Groups', labelZh: '分组数', type: 'number', default: 1, min: 1, max: 512 },
      { name: 'bias', label: 'Use Bias', labelZh: '使用偏置', type: 'boolean', default: true },
    ],
    defaultParams: { out_channels: 64, kernel_size: 3, stride: 1, padding: 1, dilation: 1, groups: 1, bias: true },
    description: '2D卷积层，用于图像和特征图处理',
  },
  maxpool: {
    type: 'maxpool',
    label: 'MaxPool2D',
    labelZh: '最大池化',
    color: '#8b5cf6',
    icon: '⬇',
    category: 'pool',
    params: [
      { name: 'kernel_size', label: 'Kernel Size', labelZh: '池化核大小', type: 'number', default: 2, min: 1, max: 16 },
      { name: 'stride', label: 'Stride', labelZh: '步长', type: 'number', default: 2, min: 1, max: 16 },
      { name: 'padding', label: 'Padding', labelZh: '填充', type: 'number', default: 0, min: 0, max: 8 },
    ],
    defaultParams: { kernel_size: 2, stride: 2, padding: 0 },
    description: '最大池化层，用于下采样',
  },
  avgpool: {
    type: 'avgpool',
    label: 'AvgPool2D',
    labelZh: '平均池化',
    color: '#8b5cf6',
    icon: '⬇',
    category: 'pool',
    params: [
      { name: 'kernel_size', label: 'Kernel Size', labelZh: '池化核大小', type: 'number', default: 2, min: 1, max: 16 },
      { name: 'stride', label: 'Stride', labelZh: '步长', type: 'number', default: 2, min: 1, max: 16 },
      { name: 'padding', label: 'Padding', labelZh: '填充', type: 'number', default: 0, min: 0, max: 8 },
    ],
    defaultParams: { kernel_size: 2, stride: 2, padding: 0 },
    description: '平均池化层，用于下采样',
  },
  fc: {
    type: 'fc',
    label: 'Linear',
    labelZh: '全连接层',
    color: '#10b981',
    icon: '⚡',
    category: 'fc',
    params: [
      { name: 'out_features', label: 'Out Features', labelZh: '输出特征', type: 'number', default: 512, min: 1, max: 65536 },
      { name: 'bias', label: 'Use Bias', labelZh: '使用偏置', type: 'boolean', default: true },
    ],
    defaultParams: { out_features: 512, bias: true },
    description: '全连接层（线性变换）',
  },
  relu: {
    type: 'relu',
    label: 'ReLU',
    labelZh: 'ReLU激活',
    color: '#f59e0b',
    icon: '🔥',
    category: 'activation',
    params: [
      { name: 'inplace', label: 'Inplace', labelZh: '原地操作', type: 'boolean', default: false },
    ],
    defaultParams: { inplace: false },
    description: 'ReLU激活函数 max(0, x)',
  },
  sigmoid: {
    type: 'sigmoid',
    label: 'Sigmoid',
    labelZh: 'Sigmoid激活',
    color: '#f59e0b',
    icon: '📈',
    category: 'activation',
    params: [],
    defaultParams: {},
    description: 'Sigmoid激活函数 1/(1+exp(-x))',
  },
  tanh: {
    type: 'tanh',
    label: 'Tanh',
    labelZh: 'Tanh激活',
    color: '#f59e0b',
    icon: '🌊',
    category: 'activation',
    params: [],
    defaultParams: {},
    description: 'Tanh激活函数 (exp(x)-exp(-x))/(exp(x)+exp(-x))',
  },
  softmax: {
    type: 'softmax',
    label: 'Softmax',
    labelZh: 'Softmax激活',
    color: '#f59e0b',
    icon: '🎯',
    category: 'activation',
    params: [
      { name: 'dim', label: 'Dimension', labelZh: '维度', type: 'number', default: -1, min: -10, max: 10 },
    ],
    defaultParams: { dim: -1 },
    description: 'Softmax归一化函数',
  },
  dropout: {
    type: 'dropout',
    label: 'Dropout',
    labelZh: 'Dropout',
    color: '#64748b',
    icon: '💨',
    category: 'utility',
    params: [
      { name: 'p', label: 'Probability', labelZh: '丢弃概率', type: 'number', default: 0.5, min: 0, max: 1, step: 0.1 },
      { name: 'inplace', label: 'Inplace', labelZh: '原地操作', type: 'boolean', default: false },
    ],
    defaultParams: { p: 0.5, inplace: false },
    description: 'Dropout正则化层',
  },
  batchnorm: {
    type: 'batchnorm',
    label: 'BatchNorm2D',
    labelZh: '批归一化',
    color: '#a855f7',
    icon: '📊',
    category: 'norm',
    params: [
      { name: 'eps', label: 'Epsilon', labelZh: 'epsilon', type: 'number', default: 1e-5, min: 1e-10, max: 1e-2, step: 0.000001 },
      { name: 'momentum', label: 'Momentum', labelZh: '动量', type: 'number', default: 0.1, min: 0, max: 1, step: 0.01 },
    ],
    defaultParams: { eps: 1e-5, momentum: 0.1 },
    description: '批归一化层（2D）',
  },
  layernorm: {
    type: 'layernorm',
    label: 'LayerNorm',
    labelZh: '层归一化',
    color: '#a855f7',
    icon: '📋',
    category: 'norm',
    params: [
      { name: 'eps', label: 'Epsilon', labelZh: 'epsilon', type: 'number', default: 1e-5, min: 1e-10, max: 1e-2, step: 0.000001 },
    ],
    defaultParams: { eps: 1e-5 },
    description: '层归一化',
  },
  reshape: {
    type: 'reshape',
    label: 'Reshape',
    labelZh: '形状重塑',
    color: '#6366f1',
    icon: '🔄',
    category: 'reshape',
    params: [
      { name: 'shape', label: 'Shape', labelZh: '目标形状', type: 'string', default: '-1, 512' },
    ],
    defaultParams: { shape: '-1, 512' },
    description: '改变张量形状',
  },
  flatten: {
    type: 'flatten',
    label: 'Flatten',
    labelZh: '展平',
    color: '#6366f1',
    icon: '📐',
    category: 'reshape',
    params: [
      { name: 'start_dim', label: 'Start Dim', labelZh: '起始维度', type: 'number', default: 1, min: 0, max: 10 },
    ],
    defaultParams: { start_dim: 1 },
    description: '将张量展平为一维',
  },
  transpose: {
    type: 'transpose',
    label: 'Transpose',
    labelZh: '维度置换',
    color: '#6366f1',
    icon: '↔',
    category: 'reshape',
    params: [
      { name: 'dim0', label: 'Dim 0', labelZh: '维度0', type: 'number', default: 1, min: 0, max: 10 },
      { name: 'dim1', label: 'Dim 1', labelZh: '维度1', type: 'number', default: 2, min: 0, max: 10 },
    ],
    defaultParams: { dim0: 1, dim1: 2 },
    description: '交换张量的两个维度',
  },
  concat: {
    type: 'concat',
    label: 'Concat',
    labelZh: '拼接',
    color: '#14b8a6',
    icon: '➕',
    category: 'utility',
    params: [
      { name: 'dim', label: 'Dimension', labelZh: '拼接维度', type: 'number', default: 1, min: 0, max: 10 },
    ],
    defaultParams: { dim: 1 },
    description: '沿指定维度拼接多个张量',
  },
  add: {
    type: 'add',
    label: 'Add',
    labelZh: '相加',
    color: '#14b8a6',
    icon: '✨',
    category: 'utility',
    params: [],
    defaultParams: {},
    description: '两个张量逐元素相加（残差连接）',
  },
  attention: {
    type: 'attention',
    label: 'Attention',
    labelZh: '注意力机制',
    color: '#ec4899',
    icon: '👁',
    category: 'transformer',
    params: [
      { name: 'embed_dim', label: 'Embed Dim', labelZh: '嵌入维度', type: 'number', default: 512, min: 1, max: 4096 },
      { name: 'num_heads', label: 'Num Heads', labelZh: '注意力头数', type: 'number', default: 8, min: 1, max: 64 },
      { name: 'dropout', label: 'Dropout', labelZh: 'dropout', type: 'number', default: 0.1, min: 0, max: 1, step: 0.1 },
    ],
    defaultParams: { embed_dim: 512, num_heads: 8, dropout: 0.1 },
    description: '多头注意力机制',
  },
  multihead_attention: {
    type: 'multihead_attention',
    label: 'MultiHeadAttention',
    labelZh: '多头注意力',
    color: '#ec4899',
    icon: '🎯',
    category: 'transformer',
    params: [
      { name: 'embed_dim', label: 'Embed Dim', labelZh: '嵌入维度', type: 'number', default: 512, min: 1, max: 4096 },
      { name: 'num_heads', label: 'Num Heads', labelZh: '头数', type: 'number', default: 8, min: 1, max: 64 },
      { name: 'dropout', label: 'Dropout', labelZh: 'dropout', type: 'number', default: 0.1, min: 0, max: 1, step: 0.1 },
    ],
    defaultParams: { embed_dim: 512, num_heads: 8, dropout: 0.1 },
    description: 'PyTorch内置的多头注意力',
  },
  embedding: {
    type: 'embedding',
    label: 'Embedding',
    labelZh: '嵌入层',
    color: '#f472b6',
    icon: '📝',
    category: 'transformer',
    params: [
      { name: 'num_embeddings', label: 'Vocab Size', labelZh: '词表大小', type: 'number', default: 30000, min: 1, max: 1000000 },
      { name: 'embed_dim', label: 'Embed Dim', labelZh: '嵌入维度', type: 'number', default: 512, min: 1, max: 4096 },
      { name: 'padding_idx', label: 'Padding Idx', labelZh: 'padding索引', type: 'number', default: 0, min: 0, max: 100000 },
    ],
    defaultParams: { num_embeddings: 30000, embed_dim: 512, padding_idx: 0 },
    description: '词嵌入层',
  },
  lstm: {
    type: 'lstm',
    label: 'LSTM',
    labelZh: 'LSTM',
    color: '#06b6d4',
    icon: '🧠',
    category: 'rnn',
    params: [
      { name: 'input_size', label: 'Input Size', labelZh: '输入维度', type: 'number', default: 512, min: 1, max: 4096 },
      { name: 'hidden_size', label: 'Hidden Size', labelZh: '隐藏维度', type: 'number', default: 512, min: 1, max: 4096 },
      { name: 'num_layers', label: 'Num Layers', labelZh: '层数', type: 'number', default: 1, min: 1, max: 16 },
      { name: 'bidirectional', label: 'Bidirectional', labelZh: '双向', type: 'boolean', default: false },
      { name: 'dropout', label: 'Dropout', labelZh: 'dropout', type: 'number', default: 0, min: 0, max: 1, step: 0.1 },
    ],
    defaultParams: { input_size: 512, hidden_size: 512, num_layers: 1, bidirectional: false, dropout: 0 },
    description: '长短期记忆网络',
  },
  gru: {
    type: 'gru',
    label: 'GRU',
    labelZh: 'GRU',
    color: '#06b6d4',
    icon: '🧠',
    category: 'rnn',
    params: [
      { name: 'input_size', label: 'Input Size', labelZh: '输入维度', type: 'number', default: 512, min: 1, max: 4096 },
      { name: 'hidden_size', label: 'Hidden Size', labelZh: '隐藏维度', type: 'number', default: 512, min: 1, max: 4096 },
      { name: 'num_layers', label: 'Num Layers', labelZh: '层数', type: 'number', default: 1, min: 1, max: 16 },
      { name: 'bidirectional', label: 'Bidirectional', labelZh: '双向', type: 'boolean', default: false },
      { name: 'dropout', label: 'Dropout', labelZh: 'dropout', type: 'number', default: 0, min: 0, max: 1, step: 0.1 },
    ],
    defaultParams: { input_size: 512, hidden_size: 512, num_layers: 1, bidirectional: false, dropout: 0 },
    description: '门控循环单元',
  },
};

export const CATEGORIES = [
  { key: 'input', label: '输入/输出', labelZh: '输入/输出' },
  { key: 'conv', label: '卷积', labelZh: '卷积' },
  { key: 'pool', label: '池化', labelZh: '池化' },
  { key: 'fc', label: '全连接', labelZh: '全连接' },
  { key: 'activation', label: '激活函数', labelZh: '激活函数' },
  { key: 'norm', label: '归一化', labelZh: '归一化' },
  { key: 'transformer', label: 'Transformer', labelZh: 'Transformer' },
  { key: 'rnn', label: '循环网络', labelZh: '循环网络' },
  { key: 'reshape', label: '形状变换', labelZh: '形状变换' },
  { key: 'utility', label: '工具层', labelZh: '工具层' },
];

export function getComponentsByCategory(category: string): ComponentConfig[] {
  return Object.values(NODE_COMPONENTS).filter(c => c.category === category);
}
