import React, { useCallback, useMemo, useRef, useState } from 'react';
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Panel,
  type NodeChange,
  type EdgeChange,
  type Connection,
  type ReactFlowInstance
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useMindMapStore } from '../store/mindmap';
import type { MindMapNode, MindMapEdge } from '../types/mindmap';
import MindMapNodeComponent from './MindMapNode';

export const MindMap: React.FC<{}> = () => {
  const { 
    nodes, 
    edges, 
    setNodes, 
    setEdges,
    setSelectedNode,
    addNode
  } = useMindMapStore();

  const nodeTypes = useMemo(() => ({
    default: MindMapNodeComponent
  }), []);

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const updatedNodes = applyNodeChanges(changes, nodes);
      setNodes(updatedNodes as MindMapNode[]);
      
      // Update selected node when selection changes
      const selectionChange = changes.find(change => change.type === 'select');
      if (selectionChange) {
        setSelectedNode(selectionChange.selected ? selectionChange.id : null);
      }
    },
    [nodes, setNodes, setSelectedNode]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const updatedEdges = applyEdgeChanges(changes, edges);
      setEdges(updatedEdges as MindMapEdge[]);
    },
    [edges, setEdges]
  );  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source && params.target) {
        // Prevent duplicate connections
        const duplicateConnection = edges.some(
          edge => 
            (edge.source === params.source && edge.target === params.target) ||
            (edge.source === params.target && edge.target === params.source)
        );

        if (!duplicateConnection && params.source !== params.target) {
          const edge = addEdge({
            ...params,
            type: 'default',
            style: { 
              stroke: '#60a5fa', 
              strokeWidth: 2,
            }
          }, edges);
          setEdges(edge as MindMapEdge[]);
        }
      }
    },
    [edges, setEdges]
  );
  const createNode = useCallback(
    (event: React.MouseEvent) => {
      // Only create node on double click
      if (event.detail !== 2 || !reactFlowInstance || !reactFlowWrapper.current) return;

      // Get the flow wrapper element
      const bounds = reactFlowWrapper.current.getBoundingClientRect();

      // Get the relative position in the flow
      const position = reactFlowInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const newNode: Partial<MindMapNode> = {
        type: 'default',
        position,
        data: {
          label: 'New Node',
          content: '',
          tags: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        id: `node-${Date.now()}`,
      };

      addNode(newNode);
    },
    [addNode]
  );

  return (
    <div className="w-full h-screen" ref={reactFlowWrapper} onDoubleClick={createNode}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onNodeClick={(_, node) => setSelectedNode(node.id)}
        fitView
        className="bg-gray-900"
        defaultViewport={{ x: 0, y: 0, zoom: 1.5 }}
        snapToGrid
        snapGrid={[15, 15]}
      >
        <Controls />
        <Background />
        <Panel position="top-right" className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg">
          <button
            onClick={() => {
              const now = new Date().toISOString();
              const newNode = {
                type: 'default',
                position: { x: 100, y: 100 },
                data: {
                  label: 'New Node',
                  content: '',
                  tags: [],
                  createdAt: now,
                  updatedAt: now
                },
                id: `node-${Date.now()}`,
              };
              addNode(newNode);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Add Node
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
};
