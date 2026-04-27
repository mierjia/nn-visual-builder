import { Node, Edge } from 'reactflow';
import { NNNodeData } from '@/types';

export interface NetworkTemplate {
  id: string;
  name: string;
  description: string;
  category: 'classification' | 'segmentation' | 'detection' | 'nlp' | 'rnn' | 'custom';
  icon: string;
  thumbnail?: string; // emoji or icon for preview
  nodes: Node<NNNodeData>[];
  edges: Edge[];
  tags: string[];
}

// ─────────────────────────────────────────────
//  LeNet-5  (Simple CNN, 手写数字识别)
// ─────────────────────────────────────────────
const LENET: NetworkTemplate = {
  id: 'lenet5',
  name: 'LeNet-5',
  description: '经典卷积神经网络，适合手写数字识别（MNIST）任务',
  category: 'classification',
  icon: '🔢',
  thumbnail: '📊',
  tags: ['CNN', '图像分类', '入门'],
  nodes: [
    { id: 'n1', type: 'nnNode', position: { x: 60, y: 200 }, data: { label: 'Input', type: 'input', params: { channels: 1, height: 32, width: 32 }, inputShape: {}, outputShape: { channels: 1, height: 32, width: 32 } } },
    { id: 'n2', type: 'nnNode', position: { x: 220, y: 200 }, data: { label: 'Conv2D', type: 'conv2d', params: { out_channels: 6, kernel_size: 5, stride: 1, padding: 0, dilation: 1, groups: 1, bias: true }, inputShape: { channels: 1, height: 32, width: 32 }, outputShape: { channels: 6, height: 28, width: 28 } } },
    { id: 'n3', type: 'nnNode', position: { x: 380, y: 200 }, data: { label: 'ReLU', type: 'relu', params: { inplace: false }, inputShape: { channels: 6, height: 28, width: 28 }, outputShape: { channels: 6, height: 28, width: 28 } } },
    { id: 'n4', type: 'nnNode', position: { x: 540, y: 200 }, data: { label: 'MaxPool2D', type: 'maxpool', params: { kernel_size: 2, stride: 2, padding: 0 }, inputShape: { channels: 6, height: 28, width: 28 }, outputShape: { channels: 6, height: 14, width: 14 } } },
    { id: 'n5', type: 'nnNode', position: { x: 700, y: 200 }, data: { label: 'Conv2D', type: 'conv2d', params: { out_channels: 16, kernel_size: 5, stride: 1, padding: 0, dilation: 1, groups: 1, bias: true }, inputShape: { channels: 6, height: 14, width: 14 }, outputShape: { channels: 16, height: 10, width: 10 } } },
    { id: 'n6', type: 'nnNode', position: { x: 860, y: 200 }, data: { label: 'ReLU', type: 'relu', params: { inplace: false }, inputShape: { channels: 16, height: 10, width: 10 }, outputShape: { channels: 16, height: 10, width: 10 } } },
    { id: 'n7', type: 'nnNode', position: { x: 1020, y: 200 }, data: { label: 'MaxPool2D', type: 'maxpool', params: { kernel_size: 2, stride: 2, padding: 0 }, inputShape: { channels: 16, height: 10, width: 10 }, outputShape: { channels: 16, height: 5, width: 5 } } },
    { id: 'n8', type: 'nnNode', position: { x: 1180, y: 200 }, data: { label: 'Flatten', type: 'flatten', params: { start_dim: 1 }, inputShape: { channels: 16, height: 5, width: 5 }, outputShape: { features: 400 } } },
    { id: 'n9', type: 'nnNode', position: { x: 1340, y: 200 }, data: { label: 'Linear', type: 'fc', params: { out_features: 120, bias: true }, inputShape: { features: 400 }, outputShape: { features: 120 } } },
    { id: 'n10', type: 'nnNode', position: { x: 1500, y: 200 }, data: { label: 'ReLU', type: 'relu', params: { inplace: false }, inputShape: { features: 120 }, outputShape: { features: 120 } } },
    { id: 'n11', type: 'nnNode', position: { x: 1660, y: 200 }, data: { label: 'Linear', type: 'fc', params: { out_features: 84, bias: true }, inputShape: { features: 120 }, outputShape: { features: 84 } } },
    { id: 'n12', type: 'nnNode', position: { x: 1820, y: 200 }, data: { label: 'Linear', type: 'fc', params: { out_features: 10, bias: true }, inputShape: { features: 84 }, outputShape: { features: 10 } } },
    { id: 'n13', type: 'nnNode', position: { x: 1980, y: 200 }, data: { label: 'Output', type: 'output', params: { features: 10 }, inputShape: { features: 10 }, outputShape: { features: 10 } } },
  ],
  edges: [
    { id: 'e1-2', source: 'n1', target: 'n2', type: 'smoothstep', animated: true },
    { id: 'e2-3', source: 'n2', target: 'n3', type: 'smoothstep', animated: true },
    { id: 'e3-4', source: 'n3', target: 'n4', type: 'smoothstep', animated: true },
    { id: 'e4-5', source: 'n4', target: 'n5', type: 'smoothstep', animated: true },
    { id: 'e5-6', source: 'n5', target: 'n6', type: 'smoothstep', animated: true },
    { id: 'e6-7', source: 'n6', target: 'n7', type: 'smoothstep', animated: true },
    { id: 'e7-8', source: 'n7', target: 'n8', type: 'smoothstep', animated: true },
    { id: 'e8-9', source: 'n8', target: 'n9', type: 'smoothstep', animated: true },
    { id: 'e9-10', source: 'n9', target: 'n10', type: 'smoothstep', animated: true },
    { id: 'e10-11', source: 'n10', target: 'n11', type: 'smoothstep', animated: true },
    { id: 'e11-12', source: 'n11', target: 'n12', type: 'smoothstep', animated: true },
    { id: 'e12-13', source: 'n12', target: 'n13', type: 'smoothstep', animated: true },
  ],
};

// ─────────────────────────────────────────────
//  ResNet Block  (残差连接)
// ─────────────────────────────────────────────
const RESNET: NetworkTemplate = {
  id: 'resnet_block',
  name: 'ResNet Block',
  description: '残差网络基本块，包含跳跃连接（Skip Connection），解决深层网络梯度消失问题',
  category: 'classification',
  icon: '🔀',
  thumbnail: '↗️',
  tags: ['ResNet', '残差连接', '图像分类', 'Skip Connection'],
  nodes: [
    { id: 'rn1', type: 'nnNode', position: { x: 60, y: 250 }, data: { label: 'Input', type: 'input', params: { channels: 64, height: 56, width: 56 }, inputShape: {}, outputShape: { channels: 64, height: 56, width: 56 } } },
    // Main branch
    { id: 'rn2', type: 'nnNode', position: { x: 220, y: 150 }, data: { label: 'Conv2D 3x3', type: 'conv2d', params: { out_channels: 64, kernel_size: 3, stride: 1, padding: 1, dilation: 1, groups: 1, bias: false }, inputShape: { channels: 64, height: 56, width: 56 }, outputShape: { channels: 64, height: 56, width: 56 } } },
    { id: 'rn3', type: 'nnNode', position: { x: 400, y: 150 }, data: { label: 'BatchNorm2D', type: 'batchnorm', params: { eps: 1e-5, momentum: 0.1 }, inputShape: { channels: 64, height: 56, width: 56 }, outputShape: { channels: 64, height: 56, width: 56 } } },
    { id: 'rn4', type: 'nnNode', position: { x: 580, y: 150 }, data: { label: 'ReLU', type: 'relu', params: { inplace: true }, inputShape: { channels: 64, height: 56, width: 56 }, outputShape: { channels: 64, height: 56, width: 56 } } },
    { id: 'rn5', type: 'nnNode', position: { x: 760, y: 150 }, data: { label: 'Conv2D 3x3', type: 'conv2d', params: { out_channels: 64, kernel_size: 3, stride: 1, padding: 1, dilation: 1, groups: 1, bias: false }, inputShape: { channels: 64, height: 56, width: 56 }, outputShape: { channels: 64, height: 56, width: 56 } } },
    { id: 'rn6', type: 'nnNode', position: { x: 940, y: 150 }, data: { label: 'BatchNorm2D', type: 'batchnorm', params: { eps: 1e-5, momentum: 0.1 }, inputShape: { channels: 64, height: 56, width: 56 }, outputShape: { channels: 64, height: 56, width: 56 } } },
    // Skip connection + Add
    { id: 'rn7', type: 'nnNode', position: { x: 1120, y: 250 }, data: { label: 'Add', type: 'add', params: {}, inputShape: { channels: 64, height: 56, width: 56 }, outputShape: { channels: 64, height: 56, width: 56 } } },
    { id: 'rn8', type: 'nnNode', position: { x: 1300, y: 250 }, data: { label: 'ReLU', type: 'relu', params: { inplace: true }, inputShape: { channels: 64, height: 56, width: 56 }, outputShape: { channels: 64, height: 56, width: 56 } } },
    { id: 'rn9', type: 'nnNode', position: { x: 1480, y: 250 }, data: { label: 'Output', type: 'output', params: { features: 64 }, inputShape: { channels: 64, height: 56, width: 56 }, outputShape: { channels: 64, height: 56, width: 56 } } },
  ],
  edges: [
    { id: 're1', source: 'rn1', target: 'rn2', type: 'smoothstep', animated: true },
    { id: 're2', source: 'rn2', target: 'rn3', type: 'smoothstep', animated: true },
    { id: 're3', source: 'rn3', target: 'rn4', type: 'smoothstep', animated: true },
    { id: 're4', source: 'rn4', target: 'rn5', type: 'smoothstep', animated: true },
    { id: 're5', source: 'rn5', target: 'rn6', type: 'smoothstep', animated: true },
    { id: 're6', source: 'rn6', target: 'rn7', type: 'smoothstep', animated: true },
    // Skip connection: input → add
    { id: 're7', source: 'rn1', target: 'rn7', type: 'smoothstep', animated: true, style: { stroke: '#f59e0b', strokeDasharray: '5,5' } },
    { id: 're8', source: 'rn7', target: 'rn8', type: 'smoothstep', animated: true },
    { id: 're9', source: 'rn8', target: 'rn9', type: 'smoothstep', animated: true },
  ],
};

// ─────────────────────────────────────────────
//  U-Net  (图像分割)
// ─────────────────────────────────────────────
const UNET: NetworkTemplate = {
  id: 'unet',
  name: 'U-Net',
  description: '编码器-解码器架构，用于医学图像分割，包含跳跃连接（Skip Connections）',
  category: 'segmentation',
  icon: '🏥',
  thumbnail: 'U',
  tags: ['U-Net', '图像分割', 'Encoder-Decoder', '医学图像'],
  nodes: [
    // Input
    { id: 'u1', type: 'nnNode', position: { x: 60, y: 400 }, data: { label: 'Input', type: 'input', params: { channels: 1, height: 572, width: 572 }, inputShape: {}, outputShape: { channels: 1, height: 572, width: 572 } } },
    // Encoder block 1
    { id: 'u2', type: 'nnNode', position: { x: 220, y: 300 }, data: { label: 'Conv2D 64', type: 'conv2d', params: { out_channels: 64, kernel_size: 3, stride: 1, padding: 1, dilation: 1, groups: 1, bias: true }, inputShape: { channels: 1, height: 572, width: 572 }, outputShape: { channels: 64, height: 572, width: 572 } } },
    { id: 'u3', type: 'nnNode', position: { x: 380, y: 300 }, data: { label: 'Conv2D 64', type: 'conv2d', params: { out_channels: 64, kernel_size: 3, stride: 1, padding: 1, dilation: 1, groups: 1, bias: true }, inputShape: { channels: 64, height: 572, width: 572 }, outputShape: { channels: 64, height: 572, width: 572 } } },
    // MaxPool 1
    { id: 'u4', type: 'nnNode', position: { x: 540, y: 400 }, data: { label: 'MaxPool2D', type: 'maxpool', params: { kernel_size: 2, stride: 2, padding: 0 }, inputShape: { channels: 64, height: 572, width: 572 }, outputShape: { channels: 64, height: 286, width: 286 } } },
    // Encoder block 2
    { id: 'u5', type: 'nnNode', position: { x: 700, y: 300 }, data: { label: 'Conv2D 128', type: 'conv2d', params: { out_channels: 128, kernel_size: 3, stride: 1, padding: 1, dilation: 1, groups: 1, bias: true }, inputShape: { channels: 64, height: 286, width: 286 }, outputShape: { channels: 128, height: 286, width: 286 } } },
    { id: 'u6', type: 'nnNode', position: { x: 860, y: 300 }, data: { label: 'Conv2D 128', type: 'conv2d', params: { out_channels: 128, kernel_size: 3, stride: 1, padding: 1, dilation: 1, groups: 1, bias: true }, inputShape: { channels: 128, height: 286, width: 286 }, outputShape: { channels: 128, height: 286, width: 286 } } },
    // Bottleneck (MaxPool 2 → Conv)
    { id: 'u7', type: 'nnNode', position: { x: 1020, y: 400 }, data: { label: 'MaxPool2D', type: 'maxpool', params: { kernel_size: 2, stride: 2, padding: 0 }, inputShape: { channels: 128, height: 286, width: 286 }, outputShape: { channels: 128, height: 143, width: 143 } } },
    { id: 'u8', type: 'nnNode', position: { x: 1180, y: 400 }, data: { label: 'Conv2D 256', type: 'conv2d', params: { out_channels: 256, kernel_size: 3, stride: 1, padding: 1, dilation: 1, groups: 1, bias: true }, inputShape: { channels: 128, height: 143, width: 143 }, outputShape: { channels: 256, height: 143, width: 143 } } },
    // Decoder: Concat + Conv
    { id: 'u9', type: 'nnNode', position: { x: 1340, y: 300 }, data: { label: 'Concat', type: 'concat', params: { dim: 1 }, inputShape: { channels: 256, height: 286, width: 286 }, outputShape: { channels: 256, height: 286, width: 286 } } },
    { id: 'u10', type: 'nnNode', position: { x: 1500, y: 300 }, data: { label: 'Conv2D 128', type: 'conv2d', params: { out_channels: 128, kernel_size: 3, stride: 1, padding: 1, dilation: 1, groups: 1, bias: true }, inputShape: { channels: 256, height: 286, width: 286 }, outputShape: { channels: 128, height: 286, width: 286 } } },
    { id: 'u11', type: 'nnNode', position: { x: 1660, y: 300 }, data: { label: 'Conv2D 2', type: 'conv2d', params: { out_channels: 2, kernel_size: 1, stride: 1, padding: 0, dilation: 1, groups: 1, bias: true }, inputShape: { channels: 128, height: 572, width: 572 }, outputShape: { channels: 2, height: 572, width: 572 } } },
    // Output
    { id: 'u12', type: 'nnNode', position: { x: 1820, y: 400 }, data: { label: 'Output', type: 'output', params: { features: 2 }, inputShape: { channels: 2, height: 572, width: 572 }, outputShape: { channels: 2, height: 572, width: 572 } } },
  ],
  edges: [
    { id: 'ue1', source: 'u1', target: 'u2', type: 'smoothstep', animated: true },
    { id: 'ue2', source: 'u2', target: 'u3', type: 'smoothstep', animated: true },
    { id: 'ue3', source: 'u3', target: 'u4', type: 'smoothstep', animated: true },
    { id: 'ue4', source: 'u4', target: 'u5', type: 'smoothstep', animated: true },
    { id: 'ue5', source: 'u5', target: 'u6', type: 'smoothstep', animated: true },
    { id: 'ue6', source: 'u6', target: 'u7', type: 'smoothstep', animated: true },
    { id: 'ue7', source: 'u7', target: 'u8', type: 'smoothstep', animated: true },
    { id: 'ue8', source: 'u8', target: 'u9', type: 'smoothstep', animated: true },
    // Skip connection: encoder feature → concat
    { id: 'ue9', source: 'u6', target: 'u9', type: 'smoothstep', animated: true, style: { stroke: '#f59e0b', strokeDasharray: '5,5' } },
    { id: 'ue10', source: 'u9', target: 'u10', type: 'smoothstep', animated: true },
    { id: 'ue11', source: 'u10', target: 'u11', type: 'smoothstep', animated: true },
    { id: 'ue12', source: 'u11', target: 'u12', type: 'smoothstep', animated: true },
  ],
};

// ─────────────────────────────────────────────
//  Transformer Encoder Block
// ─────────────────────────────────────────────
const TRANSFORMER: NetworkTemplate = {
  id: 'transformer_encoder',
  name: 'Transformer Encoder',
  description: 'Transformer 编码器块，包含多头注意力 + 前馈网络，适合 NLP 和视觉任务',
  category: 'nlp',
  icon: '🤖',
  thumbnail: '🔵',
  tags: ['Transformer', 'NLP', 'Attention', 'BERT', 'ViT'],
  nodes: [
    { id: 't1', type: 'nnNode', position: { x: 60, y: 300 }, data: { label: 'Input (Tokens)', type: 'input', params: { channels: 1, height: 512, width: 1 }, inputShape: {}, outputShape: { sequence: 128, features: 512 } } },
    { id: 't2', type: 'nnNode', position: { x: 240, y: 300 }, data: { label: 'LayerNorm', type: 'layernorm', params: { eps: 1e-5 }, inputShape: { sequence: 128, features: 512 }, outputShape: { sequence: 128, features: 512 } } },
    { id: 't3', type: 'nnNode', position: { x: 420, y: 300 }, data: { label: 'MultiHeadAttn', type: 'multihead_attention', params: { embed_dim: 512, num_heads: 8, dropout: 0.1 }, inputShape: { sequence: 128, features: 512 }, outputShape: { sequence: 128, features: 512 } } },
    { id: 't4', type: 'nnNode', position: { x: 600, y: 300 }, data: { label: 'Dropout', type: 'dropout', params: { p: 0.1, inplace: false }, inputShape: { sequence: 128, features: 512 }, outputShape: { sequence: 128, features: 512 } } },
    // Residual add 1
    { id: 't5', type: 'nnNode', position: { x: 780, y: 300 }, data: { label: 'Add (Residual)', type: 'add', params: {}, inputShape: { sequence: 128, features: 512 }, outputShape: { sequence: 128, features: 512 } } },
    { id: 't6', type: 'nnNode', position: { x: 960, y: 300 }, data: { label: 'LayerNorm', type: 'layernorm', params: { eps: 1e-5 }, inputShape: { sequence: 128, features: 512 }, outputShape: { sequence: 128, features: 512 } } },
    // FFN
    { id: 't7', type: 'nnNode', position: { x: 1140, y: 300 }, data: { label: 'Linear 2048', type: 'fc', params: { out_features: 2048, bias: true }, inputShape: { sequence: 128, features: 512 }, outputShape: { features: 2048 } } },
    { id: 't8', type: 'nnNode', position: { x: 1320, y: 300 }, data: { label: 'ReLU', type: 'relu', params: { inplace: false }, inputShape: { features: 2048 }, outputShape: { features: 2048 } } },
    { id: 't9', type: 'nnNode', position: { x: 1500, y: 300 }, data: { label: 'Linear 512', type: 'fc', params: { out_features: 512, bias: true }, inputShape: { features: 2048 }, outputShape: { features: 512 } } },
    { id: 't10', type: 'nnNode', position: { x: 1680, y: 300 }, data: { label: 'Dropout', type: 'dropout', params: { p: 0.1, inplace: false }, inputShape: { features: 512 }, outputShape: { features: 512 } } },
    // Residual add 2
    { id: 't11', type: 'nnNode', position: { x: 1860, y: 300 }, data: { label: 'Add (Residual)', type: 'add', params: {}, inputShape: { features: 512 }, outputShape: { features: 512 } } },
    { id: 't12', type: 'nnNode', position: { x: 2040, y: 300 }, data: { label: 'Output', type: 'output', params: { features: 512 }, inputShape: { features: 512 }, outputShape: { features: 512 } } },
  ],
  edges: [
    { id: 'te1', source: 't1', target: 't2', type: 'smoothstep', animated: true },
    { id: 'te2', source: 't2', target: 't3', type: 'smoothstep', animated: true },
    { id: 'te3', source: 't3', target: 't4', type: 'smoothstep', animated: true },
    { id: 'te4', source: 't4', target: 't5', type: 'smoothstep', animated: true },
    // Residual from t1 → t5
    { id: 'te5', source: 't1', target: 't5', type: 'smoothstep', animated: true, style: { stroke: '#f59e0b', strokeDasharray: '5,5' } },
    { id: 'te6', source: 't5', target: 't6', type: 'smoothstep', animated: true },
    { id: 'te7', source: 't6', target: 't7', type: 'smoothstep', animated: true },
    { id: 'te8', source: 't7', target: 't8', type: 'smoothstep', animated: true },
    { id: 'te9', source: 't8', target: 't9', type: 'smoothstep', animated: true },
    { id: 'te10', source: 't9', target: 't10', type: 'smoothstep', animated: true },
    { id: 'te11', source: 't10', target: 't11', type: 'smoothstep', animated: true },
    // Residual from t5 → t11
    { id: 'te12', source: 't5', target: 't11', type: 'smoothstep', animated: true, style: { stroke: '#f59e0b', strokeDasharray: '5,5' } },
    { id: 'te13', source: 't11', target: 't12', type: 'smoothstep', animated: true },
  ],
};

// ─────────────────────────────────────────────
//  RNN Text Classifier (LSTM-based)
// ─────────────────────────────────────────────
const RNN_CLASSIFIER: NetworkTemplate = {
  id: 'rnn_classifier',
  name: 'RNN 文本分类器',
  description: '基于双向 LSTM 的文本分类模型，适合情感分析等 NLP 任务',
  category: 'rnn',
  icon: '📖',
  thumbnail: '🔄',
  tags: ['RNN', 'LSTM', 'NLP', '文本分类', '情感分析'],
  nodes: [
    { id: 'r1', type: 'nnNode', position: { x: 60, y: 300 }, data: { label: 'Input (Token IDs)', type: 'input', params: { channels: 1, height: 256, width: 1 }, inputShape: {}, outputShape: { sequence: 256, features: 1 } } },
    { id: 'r2', type: 'nnNode', position: { x: 240, y: 300 }, data: { label: 'Embedding', type: 'embedding', params: { num_embeddings: 30000, embed_dim: 256, padding_idx: 0 }, inputShape: { sequence: 256, features: 1 }, outputShape: { sequence: 256, features: 256 } } },
    { id: 'r3', type: 'nnNode', position: { x: 420, y: 300 }, data: { label: 'Dropout', type: 'dropout', params: { p: 0.3, inplace: false }, inputShape: { sequence: 256, features: 256 }, outputShape: { sequence: 256, features: 256 } } },
    { id: 'r4', type: 'nnNode', position: { x: 600, y: 300 }, data: { label: 'Bi-LSTM', type: 'lstm', params: { input_size: 256, hidden_size: 128, num_layers: 2, bidirectional: true, dropout: 0.3 }, inputShape: { sequence: 256, features: 256 }, outputShape: { sequence: 256, features: 256 } } },
    { id: 'r5', type: 'nnNode', position: { x: 780, y: 300 }, data: { label: 'Dropout', type: 'dropout', params: { p: 0.3, inplace: false }, inputShape: { sequence: 256, features: 256 }, outputShape: { sequence: 256, features: 256 } } },
    { id: 'r6', type: 'nnNode', position: { x: 960, y: 300 }, data: { label: 'Linear 64', type: 'fc', params: { out_features: 64, bias: true }, inputShape: { features: 256 }, outputShape: { features: 64 } } },
    { id: 'r7', type: 'nnNode', position: { x: 1140, y: 300 }, data: { label: 'ReLU', type: 'relu', params: { inplace: false }, inputShape: { features: 64 }, outputShape: { features: 64 } } },
    { id: 'r8', type: 'nnNode', position: { x: 1320, y: 300 }, data: { label: 'Linear (Classes)', type: 'fc', params: { out_features: 2, bias: true }, inputShape: { features: 64 }, outputShape: { features: 2 } } },
    { id: 'r9', type: 'nnNode', position: { x: 1500, y: 300 }, data: { label: 'Softmax', type: 'softmax', params: { dim: -1 }, inputShape: { features: 2 }, outputShape: { features: 2 } } },
    { id: 'r10', type: 'nnNode', position: { x: 1680, y: 300 }, data: { label: 'Output', type: 'output', params: { features: 2 }, inputShape: { features: 2 }, outputShape: { features: 2 } } },
  ],
  edges: [
    { id: 're1', source: 'r1', target: 'r2', type: 'smoothstep', animated: true },
    { id: 're2', source: 'r2', target: 'r3', type: 'smoothstep', animated: true },
    { id: 're3', source: 'r3', target: 'r4', type: 'smoothstep', animated: true },
    { id: 're4', source: 'r4', target: 'r5', type: 'smoothstep', animated: true },
    { id: 're5', source: 'r5', target: 'r6', type: 'smoothstep', animated: true },
    { id: 're6', source: 'r6', target: 'r7', type: 'smoothstep', animated: true },
    { id: 're7', source: 'r7', target: 'r8', type: 'smoothstep', animated: true },
    { id: 're8', source: 'r8', target: 'r9', type: 'smoothstep', animated: true },
    { id: 're9', source: 'r9', target: 'r10', type: 'smoothstep', animated: true },
  ],
};

// ─────────────────────────────────────────────
//  VGG-like CNN
// ─────────────────────────────────────────────
const VGG_CNN: NetworkTemplate = {
  id: 'vgg_cnn',
  name: 'VGG-Style CNN',
  description: '经典 VGG 风格的深度 CNN，用于图像分类，使用多层 3×3 卷积堆叠',
  category: 'classification',
  icon: '🖼',
  thumbnail: '📐',
  tags: ['CNN', 'VGG', '图像分类', '深度网络'],
  nodes: [
    { id: 'v1', type: 'nnNode', position: { x: 60, y: 300 }, data: { label: 'Input', type: 'input', params: { channels: 3, height: 224, width: 224 }, inputShape: {}, outputShape: { channels: 3, height: 224, width: 224 } } },
    // Block 1
    { id: 'v2', type: 'nnNode', position: { x: 220, y: 200 }, data: { label: 'Conv2D 64', type: 'conv2d', params: { out_channels: 64, kernel_size: 3, stride: 1, padding: 1, dilation: 1, groups: 1, bias: true }, inputShape: { channels: 3, height: 224, width: 224 }, outputShape: { channels: 64, height: 224, width: 224 } } },
    { id: 'v3', type: 'nnNode', position: { x: 380, y: 200 }, data: { label: 'BatchNorm', type: 'batchnorm', params: { eps: 1e-5, momentum: 0.1 }, inputShape: { channels: 64, height: 224, width: 224 }, outputShape: { channels: 64, height: 224, width: 224 } } },
    { id: 'v4', type: 'nnNode', position: { x: 540, y: 200 }, data: { label: 'ReLU', type: 'relu', params: { inplace: true }, inputShape: { channels: 64, height: 224, width: 224 }, outputShape: { channels: 64, height: 224, width: 224 } } },
    { id: 'v5', type: 'nnNode', position: { x: 700, y: 200 }, data: { label: 'MaxPool2D', type: 'maxpool', params: { kernel_size: 2, stride: 2, padding: 0 }, inputShape: { channels: 64, height: 224, width: 224 }, outputShape: { channels: 64, height: 112, width: 112 } } },
    // Block 2
    { id: 'v6', type: 'nnNode', position: { x: 860, y: 200 }, data: { label: 'Conv2D 128', type: 'conv2d', params: { out_channels: 128, kernel_size: 3, stride: 1, padding: 1, dilation: 1, groups: 1, bias: true }, inputShape: { channels: 64, height: 112, width: 112 }, outputShape: { channels: 128, height: 112, width: 112 } } },
    { id: 'v7', type: 'nnNode', position: { x: 1020, y: 200 }, data: { label: 'BatchNorm', type: 'batchnorm', params: { eps: 1e-5, momentum: 0.1 }, inputShape: { channels: 128, height: 112, width: 112 }, outputShape: { channels: 128, height: 112, width: 112 } } },
    { id: 'v8', type: 'nnNode', position: { x: 1180, y: 200 }, data: { label: 'ReLU', type: 'relu', params: { inplace: true }, inputShape: { channels: 128, height: 112, width: 112 }, outputShape: { channels: 128, height: 112, width: 112 } } },
    { id: 'v9', type: 'nnNode', position: { x: 1340, y: 200 }, data: { label: 'MaxPool2D', type: 'maxpool', params: { kernel_size: 2, stride: 2, padding: 0 }, inputShape: { channels: 128, height: 112, width: 112 }, outputShape: { channels: 128, height: 56, width: 56 } } },
    // FC head
    { id: 'v10', type: 'nnNode', position: { x: 1500, y: 300 }, data: { label: 'Flatten', type: 'flatten', params: { start_dim: 1 }, inputShape: { channels: 128, height: 56, width: 56 }, outputShape: { features: 401408 } } },
    { id: 'v11', type: 'nnNode', position: { x: 1660, y: 300 }, data: { label: 'Linear 4096', type: 'fc', params: { out_features: 4096, bias: true }, inputShape: { features: 401408 }, outputShape: { features: 4096 } } },
    { id: 'v12', type: 'nnNode', position: { x: 1820, y: 300 }, data: { label: 'ReLU', type: 'relu', params: { inplace: true }, inputShape: { features: 4096 }, outputShape: { features: 4096 } } },
    { id: 'v13', type: 'nnNode', position: { x: 1980, y: 300 }, data: { label: 'Dropout 0.5', type: 'dropout', params: { p: 0.5, inplace: false }, inputShape: { features: 4096 }, outputShape: { features: 4096 } } },
    { id: 'v14', type: 'nnNode', position: { x: 2140, y: 300 }, data: { label: 'Linear 1000', type: 'fc', params: { out_features: 1000, bias: true }, inputShape: { features: 4096 }, outputShape: { features: 1000 } } },
    { id: 'v15', type: 'nnNode', position: { x: 2300, y: 300 }, data: { label: 'Output', type: 'output', params: { features: 1000 }, inputShape: { features: 1000 }, outputShape: { features: 1000 } } },
  ],
  edges: [
    { id: 've1', source: 'v1', target: 'v2', type: 'smoothstep', animated: true },
    { id: 've2', source: 'v2', target: 'v3', type: 'smoothstep', animated: true },
    { id: 've3', source: 'v3', target: 'v4', type: 'smoothstep', animated: true },
    { id: 've4', source: 'v4', target: 'v5', type: 'smoothstep', animated: true },
    { id: 've5', source: 'v5', target: 'v6', type: 'smoothstep', animated: true },
    { id: 've6', source: 'v6', target: 'v7', type: 'smoothstep', animated: true },
    { id: 've7', source: 'v7', target: 'v8', type: 'smoothstep', animated: true },
    { id: 've8', source: 'v8', target: 'v9', type: 'smoothstep', animated: true },
    { id: 've9', source: 'v9', target: 'v10', type: 'smoothstep', animated: true },
    { id: 've10', source: 'v10', target: 'v11', type: 'smoothstep', animated: true },
    { id: 've11', source: 'v11', target: 'v12', type: 'smoothstep', animated: true },
    { id: 've12', source: 'v12', target: 'v13', type: 'smoothstep', animated: true },
    { id: 've13', source: 'v13', target: 'v14', type: 'smoothstep', animated: true },
    { id: 've14', source: 'v14', target: 'v15', type: 'smoothstep', animated: true },
  ],
};

// ─────────────────────────────────────────────
//  Autoencoder
// ─────────────────────────────────────────────
const AUTOENCODER: NetworkTemplate = {
  id: 'autoencoder',
  name: 'Autoencoder',
  description: '自编码器，包含编码器（降维）和解码器（重建），用于特征学习和异常检测',
  category: 'classification',
  icon: '🔁',
  thumbnail: '↔',
  tags: ['Autoencoder', '无监督', '降维', '特征学习'],
  nodes: [
    { id: 'a1', type: 'nnNode', position: { x: 60, y: 300 }, data: { label: 'Input', type: 'input', params: { channels: 1, height: 784, width: 1 }, inputShape: {}, outputShape: { features: 784 } } },
    // Encoder
    { id: 'a2', type: 'nnNode', position: { x: 220, y: 300 }, data: { label: 'Linear 256', type: 'fc', params: { out_features: 256, bias: true }, inputShape: { features: 784 }, outputShape: { features: 256 } } },
    { id: 'a3', type: 'nnNode', position: { x: 380, y: 300 }, data: { label: 'ReLU', type: 'relu', params: { inplace: false }, inputShape: { features: 256 }, outputShape: { features: 256 } } },
    { id: 'a4', type: 'nnNode', position: { x: 540, y: 300 }, data: { label: 'Linear 64 (Bottleneck)', type: 'fc', params: { out_features: 64, bias: true }, inputShape: { features: 256 }, outputShape: { features: 64 } } },
    { id: 'a5', type: 'nnNode', position: { x: 700, y: 300 }, data: { label: 'ReLU', type: 'relu', params: { inplace: false }, inputShape: { features: 64 }, outputShape: { features: 64 } } },
    // Decoder
    { id: 'a6', type: 'nnNode', position: { x: 860, y: 300 }, data: { label: 'Linear 256', type: 'fc', params: { out_features: 256, bias: true }, inputShape: { features: 64 }, outputShape: { features: 256 } } },
    { id: 'a7', type: 'nnNode', position: { x: 1020, y: 300 }, data: { label: 'ReLU', type: 'relu', params: { inplace: false }, inputShape: { features: 256 }, outputShape: { features: 256 } } },
    { id: 'a8', type: 'nnNode', position: { x: 1180, y: 300 }, data: { label: 'Linear 784', type: 'fc', params: { out_features: 784, bias: true }, inputShape: { features: 256 }, outputShape: { features: 784 } } },
    { id: 'a9', type: 'nnNode', position: { x: 1340, y: 300 }, data: { label: 'Sigmoid', type: 'sigmoid', params: {}, inputShape: { features: 784 }, outputShape: { features: 784 } } },
    { id: 'a10', type: 'nnNode', position: { x: 1500, y: 300 }, data: { label: 'Output', type: 'output', params: { features: 784 }, inputShape: { features: 784 }, outputShape: { features: 784 } } },
  ],
  edges: [
    { id: 'ae1', source: 'a1', target: 'a2', type: 'smoothstep', animated: true },
    { id: 'ae2', source: 'a2', target: 'a3', type: 'smoothstep', animated: true },
    { id: 'ae3', source: 'a3', target: 'a4', type: 'smoothstep', animated: true },
    { id: 'ae4', source: 'a4', target: 'a5', type: 'smoothstep', animated: true },
    { id: 'ae5', source: 'a5', target: 'a6', type: 'smoothstep', animated: true },
    { id: 'ae6', source: 'a6', target: 'a7', type: 'smoothstep', animated: true },
    { id: 'ae7', source: 'a7', target: 'a8', type: 'smoothstep', animated: true },
    { id: 'ae8', source: 'a8', target: 'a9', type: 'smoothstep', animated: true },
    { id: 'ae9', source: 'a9', target: 'a10', type: 'smoothstep', animated: true },
  ],
};

// ─────────────────────────────────────────────
//  MLP Classifier
// ─────────────────────────────────────────────
const MLP: NetworkTemplate = {
  id: 'mlp_classifier',
  name: 'MLP 分类器',
  description: '多层感知机，用于结构化数据分类，最简单的全连接神经网络',
  category: 'classification',
  icon: '📡',
  thumbnail: '⚡',
  tags: ['MLP', '全连接', '分类', '结构化数据', '入门'],
  nodes: [
    { id: 'm1', type: 'nnNode', position: { x: 60, y: 300 }, data: { label: 'Input', type: 'input', params: { channels: 1, height: 128, width: 1 }, inputShape: {}, outputShape: { features: 128 } } },
    { id: 'm2', type: 'nnNode', position: { x: 220, y: 300 }, data: { label: 'Linear 256', type: 'fc', params: { out_features: 256, bias: true }, inputShape: { features: 128 }, outputShape: { features: 256 } } },
    { id: 'm3', type: 'nnNode', position: { x: 380, y: 300 }, data: { label: 'BatchNorm', type: 'batchnorm', params: { eps: 1e-5, momentum: 0.1 }, inputShape: { features: 256 }, outputShape: { features: 256 } } },
    { id: 'm4', type: 'nnNode', position: { x: 540, y: 300 }, data: { label: 'ReLU', type: 'relu', params: { inplace: false }, inputShape: { features: 256 }, outputShape: { features: 256 } } },
    { id: 'm5', type: 'nnNode', position: { x: 700, y: 300 }, data: { label: 'Dropout 0.3', type: 'dropout', params: { p: 0.3, inplace: false }, inputShape: { features: 256 }, outputShape: { features: 256 } } },
    { id: 'm6', type: 'nnNode', position: { x: 860, y: 300 }, data: { label: 'Linear 128', type: 'fc', params: { out_features: 128, bias: true }, inputShape: { features: 256 }, outputShape: { features: 128 } } },
    { id: 'm7', type: 'nnNode', position: { x: 1020, y: 300 }, data: { label: 'ReLU', type: 'relu', params: { inplace: false }, inputShape: { features: 128 }, outputShape: { features: 128 } } },
    { id: 'm8', type: 'nnNode', position: { x: 1180, y: 300 }, data: { label: 'Linear 10', type: 'fc', params: { out_features: 10, bias: true }, inputShape: { features: 128 }, outputShape: { features: 10 } } },
    { id: 'm9', type: 'nnNode', position: { x: 1340, y: 300 }, data: { label: 'Softmax', type: 'softmax', params: { dim: -1 }, inputShape: { features: 10 }, outputShape: { features: 10 } } },
    { id: 'm10', type: 'nnNode', position: { x: 1500, y: 300 }, data: { label: 'Output', type: 'output', params: { features: 10 }, inputShape: { features: 10 }, outputShape: { features: 10 } } },
  ],
  edges: [
    { id: 'me1', source: 'm1', target: 'm2', type: 'smoothstep', animated: true },
    { id: 'me2', source: 'm2', target: 'm3', type: 'smoothstep', animated: true },
    { id: 'me3', source: 'm3', target: 'm4', type: 'smoothstep', animated: true },
    { id: 'me4', source: 'm4', target: 'm5', type: 'smoothstep', animated: true },
    { id: 'me5', source: 'm5', target: 'm6', type: 'smoothstep', animated: true },
    { id: 'me6', source: 'm6', target: 'm7', type: 'smoothstep', animated: true },
    { id: 'me7', source: 'm7', target: 'm8', type: 'smoothstep', animated: true },
    { id: 'me8', source: 'm8', target: 'm9', type: 'smoothstep', animated: true },
    { id: 'me9', source: 'm9', target: 'm10', type: 'smoothstep', animated: true },
  ],
};

// ─────────────────────────────────────────────
//  Export
// ─────────────────────────────────────────────
export const BUILT_IN_TEMPLATES: NetworkTemplate[] = [
  LENET,
  VGG_CNN,
  RESNET,
  AUTOENCODER,
  UNET,
  TRANSFORMER,
  RNN_CLASSIFIER,
  MLP,
];

export const TEMPLATE_CATEGORIES = [
  { key: 'all',           label: '全部',      icon: '🌐' },
  { key: 'classification', label: '图像分类',  icon: '🖼' },
  { key: 'segmentation',  label: '图像分割',  icon: '🏥' },
  { key: 'nlp',           label: 'NLP/文本',  icon: '📖' },
  { key: 'rnn',           label: 'RNN',       icon: '🔄' },
  { key: 'custom',        label: '自建模块',  icon: '🧩' },
];

// ─────────────────────────────────────────────
//  Custom Module (saved by user)
// ─────────────────────────────────────────────
export interface CustomModule {
  id: string;
  name: string;
  description: string;
  icon: string;
  createdAt: string;
  nodes: Node<NNNodeData>[];
  edges: Edge[];
}

const STORAGE_KEY = 'nn_builder_custom_modules';

export function loadCustomModules(): CustomModule[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomModule(mod: CustomModule): void {
  const existing = loadCustomModules();
  const idx = existing.findIndex(m => m.id === mod.id);
  if (idx >= 0) {
    existing[idx] = mod;
  } else {
    existing.push(mod);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

export function deleteCustomModule(id: string): void {
  const existing = loadCustomModules().filter(m => m.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}
