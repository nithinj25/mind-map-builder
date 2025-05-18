import { create } from 'zustand';
import type { MindMapNode, MindMapEdge, MindMapNodeData } from '../types/mindmap';

interface MindMapState {
  nodes: MindMapNode[];
  edges: MindMapEdge[];
  selectedNode: string | null;
  name: string;
  setNodes: (nodes: MindMapNode[] | ((prev: MindMapNode[]) => MindMapNode[])) => void;
  setEdges: (edges: MindMapEdge[] | ((prev: MindMapEdge[]) => MindMapEdge[])) => void;
  addNode: (node: Partial<MindMapNode>) => void;
  updateNode: (nodeId: string, data: Partial<MindMapNodeData>) => void;
  deleteNode: (nodeId: string) => void;
  setSelectedNode: (nodeId: string | null) => void;
  setName: (name: string) => void;
  onNodeUpdate: (nodeId: string, data: Partial<MindMapNodeData>) => void;
}

export const useMindMapStore = create<MindMapState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  name: 'Untitled Mind Map',
  
  setNodes: (nodes) => set((state) => ({
    nodes: typeof nodes === 'function' ? nodes(state.nodes) : nodes
  })),
  
  setEdges: (edges) => set((state) => ({
    edges: typeof edges === 'function' ? edges(state.edges) : edges
  })),

  updateNode: (nodeId, data) => set((state) => ({
    nodes: state.nodes.map((node) =>
      node.id === nodeId
        ? {
            ...node,
            data: {
              ...node.data,
              ...data,
              updatedAt: new Date().toISOString(),
            },
          }
        : node
    ),
  })),

  onNodeUpdate: (nodeId, data) => {
    const { updateNode } = get();
    updateNode(nodeId, data);
  },

  deleteNode: (nodeId) => set((state) => ({
    nodes: state.nodes.filter((node) => node.id !== nodeId),
    edges: state.edges.filter(
      (edge) => edge.source !== nodeId && edge.target !== nodeId
    ),
  })),

  setSelectedNode: (nodeId) => set({
    selectedNode: nodeId,
  }),

  setName: (name) => set({
    name,
  }),

  addNode: (node) => set((state) => ({
    nodes: [
      ...state.nodes,
      {
        ...node,
        data: {
          ...node.data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      } as MindMapNode,
    ],
  })),
}));