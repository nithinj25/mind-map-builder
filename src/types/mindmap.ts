import type { Node, Edge } from 'reactflow';

export interface MindMapNodeData {
  label: string;
  content?: string;
  richText?: string;
  properties?: Record<string, any>;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export type MindMapEdgeData = {
  label?: string;
  notes?: string;
  type?: 'default' | 'bidirectional';
};

export type MindMapNode = Node<MindMapNodeData>;
export type MindMapEdge = Edge<MindMapEdgeData>;

export interface MindMapData {
  nodes: MindMapNode[];
  edges: MindMapEdge[];
  version: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
