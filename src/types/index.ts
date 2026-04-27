export type NodeType = 
  | 'conv2d' 
  | 'maxpool' 
  | 'avgpool'
  | 'fc' 
  | 'relu' 
  | 'sigmoid' 
  | 'tanh' 
  | 'softmax'
  | 'dropout'
  | 'batchnorm'
  | 'layernorm'
  | 'reshape'
  | 'flatten'
  | 'transpose'
  | 'concat'
  | 'add'
  | 'attention'
  | 'multihead_attention'
  | 'embedding'
  | 'lstm'
  | 'gru'
  | 'input'
  | 'output';

export interface TensorShape {
  batch?: number;
  channels?: number;
  height?: number;
  width?: number;
  sequence?: number;
  features?: number;
}

export interface NNNodeData {
  label: string;
  type: NodeType;
  params: Record<string, any>;
  inputShape: TensorShape;
  outputShape: TensorShape;
}

export interface EdgeData {
  sourceHandle?: string;
  targetHandle?: string;
}

export interface NetworkGraph {
  nodes: Array<{
    id: string;
    type: string;
    position: { x: number; y: number };
    data: NNNodeData;
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
  }>;
}

export interface GeneratedCode {
  framework: 'pytorch' | 'tensorflow' | 'keras';
  code: string;
  imports: string[];
}
