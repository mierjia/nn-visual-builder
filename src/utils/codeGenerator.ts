import { NetworkGraph, NodeType } from '@/types';
import { NODE_COMPONENTS } from '@/utils/nodeConfig';

type Framework = 'pytorch' | 'tensorflow' | 'keras';

interface NodeInfo {
  id: string;
  type: NodeType;
  params: Record<string, any>;
  layerName: string;
}

export function generateCode(graph: NetworkGraph, framework: Framework): string {
  // 构建节点列表并排序（拓扑排序）
  const nodes = topologicalSort(graph);
  
  // 生成各框架代码
  switch (framework) {
    case 'pytorch':
      return generatePyTorchCode(nodes);
    case 'tensorflow':
      return generateTensorFlowCode(nodes);
    case 'keras':
      return generateKerasCode(nodes);
    default:
      return generatePyTorchCode(nodes);
  }
}

function topologicalSort(graph: NetworkGraph): NodeInfo[] {
  const nodeMap = new Map<string, typeof graph.nodes[0]>();
  const inDegree = new Map<string, number>();
  const adjList = new Map<string, string[]>();
  
  // 初始化
  graph.nodes.forEach((node) => {
    nodeMap.set(node.id, node);
    inDegree.set(node.id, 0);
    adjList.set(node.id, []);
  });
  
  // 计算入度和构建邻接表
  graph.edges.forEach((edge) => {
    const sources = adjList.get(edge.source) || [];
    sources.push(edge.target);
    adjList.set(edge.source, sources);
    inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
  });
  
  // Kahn算法
  const queue: string[] = [];
  inDegree.forEach((degree, id) => {
    if (degree === 0) queue.push(id);
  });
  
  const sorted: NodeInfo[] = [];
  while (queue.length > 0) {
    const id = queue.shift()!;
    const node = nodeMap.get(id)!;
    sorted.push({
      id: node.id,
      type: node.data.type,
      params: node.data.params,
      layerName: `${node.data.type}_${node.id}`,
    });
    
    const neighbors = adjList.get(id) || [];
    neighbors.forEach((neighbor) => {
      const newDegree = (inDegree.get(neighbor) || 0) - 1;
      inDegree.set(neighbor, newDegree);
      if (newDegree === 0) queue.push(neighbor);
    });
  }
  
  return sorted;
}

function generatePyTorchCode(nodes: NodeInfo[]): string {
  const imports = [
    'import torch',
    'import torch.nn as nn',
    'import torch.nn.functional as F',
  ];
  
  const layerDefinitions: string[] = [];
  const forwardStatements: string[] = [];
  
  nodes.forEach((node) => {
    const config = NODE_COMPONENTS[node.type];
    if (!config) return;
    
    switch (node.type) {
      case 'input':
        // 输入层不生成实际层
        forwardStatements.push(`# Input: ${JSON.stringify(node.params)}`);
        break;
      case 'conv2d':
        layerDefinitions.push(
          `self.${node.layerName} = nn.Conv2d(${node.params.out_channels}, ${node.params.out_channels}, ` +
          `kernel_size=${node.params.kernel_size}, stride=${node.params.stride}, ` +
          `padding=${node.params.padding}, dilation=${node.params.dilation}, ` +
          `groups=${node.params.groups}, bias=${node.params.bias})`
        );
        forwardStatements.push(`x = self.${node.layerName}(x)`);
        break;
      case 'maxpool':
        layerDefinitions.push(
          `self.${node.layerName} = nn.MaxPool2d(${node.params.kernel_size}, ${node.params.stride}, ${node.params.padding})`
        );
        forwardStatements.push(`x = self.${node.layerName}(x)`);
        break;
      case 'avgpool':
        layerDefinitions.push(
          `self.${node.layerName} = nn.AvgPool2d(${node.params.kernel_size}, ${node.params.stride}, ${node.params.padding})`
        );
        forwardStatements.push(`x = self.${node.layerName}(x)`);
        break;
      case 'fc':
        layerDefinitions.push(
          `self.${node.layerName} = nn.Linear(${node.params.out_features}, bias=${node.params.bias})`
        );
        forwardStatements.push(`x = self.${node.layerName}(x)`);
        break;
      case 'relu':
        forwardStatements.push(`x = F.relu(x, inplace=${node.params.inplace})`);
        break;
      case 'sigmoid':
        forwardStatements.push(`x = torch.sigmoid(x)`);
        break;
      case 'tanh':
        forwardStatements.push(`x = torch.tanh(x)`);
        break;
      case 'softmax':
        forwardStatements.push(`x = F.softmax(x, dim=${node.params.dim})`);
        break;
      case 'dropout':
        if (node.params.p > 0) {
          layerDefinitions.push(
            `self.${node.layerName} = nn.Dropout(${node.params.p}, inplace=${node.params.inplace})`
          );
          forwardStatements.push(`x = self.${node.layerName}(x)`);
        }
        break;
      case 'batchnorm':
        layerDefinitions.push(
          `self.${node.layerName} = nn.BatchNorm2d(num_features=${node.params.num_features || 64}, ` +
          `eps=${node.params.eps}, momentum=${node.params.momentum})`
        );
        forwardStatements.push(`x = self.${node.layerName}(x)`);
        break;
      case 'layernorm':
        layerDefinitions.push(
          `self.${node.layerName} = nn.LayerNorm(normalized_shape=${node.params.normalized_shape || 512})`
        );
        forwardStatements.push(`x = self.${node.layerName}(x)`);
        break;
      case 'flatten':
        forwardStatements.push(`x = x.flatten(start_dim=${node.params.start_dim})`);
        break;
      case 'reshape':
        forwardStatements.push(`x = x.view(${node.params.shape})`);
        break;
      case 'transpose':
        forwardStatements.push(`x = x.transpose(${node.params.dim0}, ${node.params.dim1})`);
        break;
      case 'attention':
        layerDefinitions.push(
          `self.${node.layerName} = nn.MultiheadAttention(` +
          `embed_dim=${node.params.embed_dim}, num_heads=${node.params.num_heads}, ` +
          `dropout=${node.params.dropout}, batch_first=True)`
        );
        forwardStatements.push(`x, _ = self.${node.layerName}(x, x, x)`);
        break;
      case 'multihead_attention':
        layerDefinitions.push(
          `self.${node.layerName} = nn.MultiheadAttention(` +
          `embed_dim=${node.params.embed_dim}, num_heads=${node.params.num_heads}, ` +
          `dropout=${node.params.dropout}, batch_first=True)`
        );
        forwardStatements.push(`x, _ = self.${node.layerName}(x, x, x)`);
        break;
      case 'embedding':
        layerDefinitions.push(
          `self.${node.layerName} = nn.Embedding(${node.params.num_embeddings}, ${node.params.embed_dim}, padding_idx=${node.params.padding_idx})`
        );
        forwardStatements.push(`x = self.${node.layerName}(x)`);
        break;
      case 'lstm':
        layerDefinitions.push(
          `self.${node.layerName} = nn.LSTM(${node.params.input_size}, ${node.params.hidden_size}, ` +
          `num_layers=${node.params.num_layers}, bidirectional=${node.params.bidirectional}, ` +
          `dropout=${node.params.num_layers > 1 ? node.params.dropout : 0}, batch_first=True)`
        );
        forwardStatements.push(`x, _ = self.${node.layerName}(x)`);
        break;
      case 'gru':
        layerDefinitions.push(
          `self.${node.layerName} = nn.GRU(${node.params.input_size}, ${node.params.hidden_size}, ` +
          `num_layers=${node.params.num_layers}, bidirectional=${node.params.bidirectional}, ` +
          `dropout=${node.params.num_layers > 1 ? node.params.dropout : 0}, batch_first=True)`
        );
        forwardStatements.push(`x, _ = self.${node.layerName}(x)`);
        break;
      case 'concat':
        forwardStatements.push(`# Concat nodes: ${node.id}`);
        break;
      case 'add':
        forwardStatements.push(`# Add (residual connection)`);
        break;
      case 'output':
        forwardStatements.push(`# Output layer`);
        break;
    }
  });
  
  return `"""
PyTorch Neural Network Model
Automatically generated by NN Visual Builder
"""

${imports.join('\n')}


class NeuralNetwork(nn.Module):
    """Neural Network Model"""
    
    def __init__(self):
        super().__init__()
        ${layerDefinitions.length > 0 ? layerDefinitions.join('\n        ') : 'pass'}
    
    def forward(self, x):
        """Forward pass"""
        ${forwardStatements.join('\n        ')}
        return x


# Model instantiation and usage example
if __name__ == "__main__":
    model = NeuralNetwork()
    print(model)
    
    # Example input (batch_size=1, channels=3, height=224, width=224)
    x = torch.randn(1, 3, 224, 224)
    output = model(x)
    print(f"Output shape: {output.shape}")
`;
}

function generateTensorFlowCode(nodes: NodeInfo[]): string {
  const imports = [
    'import tensorflow as tf',
    'from tensorflow import keras',
    'from tensorflow.keras import layers',
  ];
  
  const layerDefinitions: string[] = [];
  const forwardStatements: string[] = [];
  
  nodes.forEach((node) => {
    const config = NODE_COMPONENTS[node.type];
    if (!config) return;
    
    switch (node.type) {
      case 'input':
        forwardStatements.push(`# Input shape: ${JSON.stringify(node.params)}`);
        break;
      case 'conv2d':
        layerDefinitions.push(
          `${node.layerName} = layers.Conv2D(` +
          `${node.params.out_channels}, ${node.params.kernel_size}, ` +
          `strides=${node.params.stride}, padding='same', ` +
          `dilation_rate=${node.params.dilation}, use_bias=${node.params.bias})`
        );
        forwardStatements.push(`x = ${node.layerName}(x)`);
        break;
      case 'maxpool':
        layerDefinitions.push(
          `${node.layerName} = layers.MaxPooling2D(${node.params.kernel_size}, ${node.params.stride}, padding='same')`
        );
        forwardStatements.push(`x = ${node.layerName}(x)`);
        break;
      case 'avgpool':
        layerDefinitions.push(
          `${node.layerName} = layers.AveragePooling2D(${node.params.kernel_size}, ${node.params.stride}, padding='same')`
        );
        forwardStatements.push(`x = ${node.layerName}(x)`);
        break;
      case 'fc':
        layerDefinitions.push(
          `${node.layerName} = layers.Dense(${node.params.out_features}, use_bias=${node.params.bias})`
        );
        forwardStatements.push(`x = ${node.layerName}(x)`);
        break;
      case 'relu':
        forwardStatements.push(`x = layers.ReLU(${node.params.inplace ? 'max_value=6.0' : ''})(x)`);
        break;
      case 'sigmoid':
        forwardStatements.push(`x = tf.sigmoid(x)`);
        break;
      case 'tanh':
        forwardStatements.push(`x = tf.tanh(x)`);
        break;
      case 'softmax':
        forwardStatements.push(`x = tf.nn.softmax(x, axis=${node.params.dim})`);
        break;
      case 'dropout':
        if (node.params.p > 0) {
          layerDefinitions.push(`${node.layerName} = layers.Dropout(${node.params.p})`);
          forwardStatements.push(`x = ${node.layerName}(x)`);
        }
        break;
      case 'batchnorm':
        layerDefinitions.push(
          `${node.layerName} = layers.BatchNormalization(epsilon=${node.params.eps})`
        );
        forwardStatements.push(`x = ${node.layerName}(x)`);
        break;
      case 'layernorm':
        layerDefinitions.push(`${node.layerName} = layers.LayerNormalization(epsilon=${node.params.eps})`);
        forwardStatements.push(`x = ${node.layerName}(x)`);
        break;
      case 'flatten':
        forwardStatements.push(`x = layers.Flatten()(x)`);
        break;
      case 'reshape':
        forwardStatements.push(`x = layers.Reshape(${node.params.shape})(x)`);
        break;
      case 'transpose':
        forwardStatements.push(`x = tf.transpose(x, [0, ${node.params.dim1}, ${node.params.dim0}, 2])`);
        break;
      case 'attention':
        layerDefinitions.push(
          `${node.layerName} = layers.MultiHeadAttention(num_heads=${node.params.num_heads}, key_dim=${node.params.embed_dim})`
        );
        forwardStatements.push(`x = ${node.layerName}(x, x)`);
        break;
      case 'embedding':
        layerDefinitions.push(
          `${node.layerName} = layers.Embedding(${node.params.num_embeddings}, ${node.params.embed_dim}, padding_idx=${node.params.padding_idx})`
        );
        forwardStatements.push(`x = ${node.layerName}(x)`);
        break;
      case 'lstm':
        layerDefinitions.push(
          `${node.layerName} = layers.LSTM(${node.params.hidden_size}, return_sequences=True, return_state=True)`
        );
        forwardStatements.push(`x = ${node.layerName}(x)`);
        break;
      case 'gru':
        layerDefinitions.push(
          `${node.layerName} = layers.GRU(${node.params.hidden_size}, return_sequences=True, return_state=True)`
        );
        forwardStatements.push(`x = ${node.layerName}(x)`);
        break;
      case 'output':
        forwardStatements.push(`# Output layer`);
        break;
    }
  });
  
  return `"""
TensorFlow Neural Network Model
Automatically generated by NN Visual Builder
"""

${imports.join('\n')}


def build_model():
    """Build the neural network model"""
    inputs = keras.Input(shape=(None, None, 3))  # placeholder input
    
    x = inputs
    ${forwardStatements.join('\n    ')}
    
    model = keras.Model(inputs=inputs, outputs=x, name='neural_network')
    return model


# Model instantiation and usage example
if __name__ == "__main__":
    model = build_model()
    model.summary()
    
    # Example input
    x = tf.random.normal((1, 224, 224, 3))
    output = model(x)
    print(f"Output shape: {output.shape}")
`;
}

function generateKerasCode(nodes: NodeInfo[]): string {
  const imports = [
    'import tensorflow as tf',
    'from tensorflow.keras.models import Sequential',
    'from tensorflow.keras.layers import *',
  ];
  
  const layerDefinitions: string[] = [];
  
  nodes.forEach((node) => {
    const config = NODE_COMPONENTS[node.type];
    if (!config) return;
    
    switch (node.type) {
      case 'input':
        layerDefinitions.push(`# Input: ${JSON.stringify(node.params)}`);
        break;
      case 'conv2d':
        layerDefinitions.push(
          `Conv2D(${node.params.out_channels}, ${node.params.kernel_size}, ` +
          `strides=${node.params.stride}, padding='same', ` +
          `dilation_rate=${node.params.dilation}, use_bias=${node.params.bias})`
        );
        break;
      case 'maxpool':
        layerDefinitions.push(`MaxPooling2D(${node.params.kernel_size}, strides=${node.params.stride})`);
        break;
      case 'avgpool':
        layerDefinitions.push(`AveragePooling2D(${node.params.kernel_size}, strides=${node.params.stride})`);
        break;
      case 'fc':
        layerDefinitions.push(`Dense(${node.params.out_features}, use_bias=${node.params.bias})`);
        break;
      case 'relu':
        layerDefinitions.push(`ReLU(${node.params.inplace ? 'max_value=6.0' : ''})`);
        break;
      case 'sigmoid':
        layerDefinitions.push(`Activation('sigmoid')`);
        break;
      case 'tanh':
        layerDefinitions.push(`Activation('tanh')`);
        break;
      case 'softmax':
        layerDefinitions.push(`Softmax(axis=${node.params.dim})`);
        break;
      case 'dropout':
        if (node.params.p > 0) {
          layerDefinitions.push(`Dropout(${node.params.p})`);
        }
        break;
      case 'batchnorm':
        layerDefinitions.push(`BatchNormalization(epsilon=${node.params.eps})`);
        break;
      case 'layernorm':
        layerDefinitions.push(`LayerNormalization(epsilon=${node.params.eps})`);
        break;
      case 'flatten':
        layerDefinitions.push(`Flatten()`);
        break;
      case 'reshape':
        layerDefinitions.push(`Reshape(${node.params.shape})`);
        break;
      case 'transpose':
        layerDefinitions.push(`Permute((2, 1))`);
        break;
      case 'attention':
        layerDefinitions.push(
          `MultiHeadAttention(num_heads=${node.params.num_heads}, key_dim=${node.params.embed_dim})`
        );
        break;
      case 'embedding':
        layerDefinitions.push(
          `Embedding(${node.params.num_embeddings}, ${node.params.embed_dim}, padding_idx=${node.params.padding_idx})`
        );
        break;
      case 'lstm':
        layerDefinitions.push(
          `LSTM(${node.params.hidden_size}, return_sequences=True)`
        );
        break;
      case 'gru':
        layerDefinitions.push(
          `GRU(${node.params.hidden_size}, return_sequences=True)`
        );
        break;
      case 'output':
        layerDefinitions.push(`# Output layer`);
        break;
    }
  });
  
  return `"""
Keras Sequential Neural Network Model
Automatically generated by NN Visual Builder
"""

${imports.join('\n')}


def build_model():
    """Build the sequential neural network model"""
    model = Sequential([
        # Input layer
        Input(shape=(224, 224, 3)),
        
        ${layerDefinitions.filter(l => !l.startsWith('# Input')).join(',\n        ')}
    ])
    
    return model


# Model instantiation and usage example
if __name__ == "__main__":
    model = build_model()
    model.summary()
    
    # Compile model
    model.compile(optimizer='adam', loss='categorical_crossentropy')
    
    # Example input
    import numpy as np
    x = np.random.randn(1, 224, 224, 3).astype(np.float32)
    output = model(x)
    print(f"Output shape: {output.shape}")
`;
}
