import type { MindMapNode, MindMapEdge } from '../types/mindmap';

export const createNode = (
  label: string,
  position: { x: number; y: number },
  parentNode?: string
): MindMapNode => {
  const now = new Date().toISOString();
  return {
    id: `node-${Date.now()}`,
    type: 'mindMapNode',
    position,
    data: {
      label,
      createdAt: now,
      updatedAt: now
    },
    parentNode,
  };
};

export const createEdge = (
  source: string,
  target: string,
  label?: string
): MindMapEdge => ({
  id: `edge-${source}-${target}`,
  source,
  target,
  type: 'smoothstep',
  data: label ? { label } : undefined,
});

export const calculateNewNodePosition = (
  parentNode: MindMapNode,
  existingNodes: MindMapNode[],
  spacing = { x: 200, y: 100 }
) => {
  const childNodes = existingNodes.filter((node) => node.parentNode === parentNode.id);
  const angleStep = (2 * Math.PI) / (childNodes.length + 1);
  const currentAngle = angleStep * (childNodes.length + 1);

  return {
    x: parentNode.position.x + Math.cos(currentAngle) * spacing.x,
    y: parentNode.position.y + Math.sin(currentAngle) * spacing.y,
  };
};
