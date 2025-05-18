import { memo, useState, useRef, useEffect, useCallback } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import type { MindMapNodeData } from '../types/mindmap';
import { PencilIcon, CheckIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useMindMapStore } from '../store/mindmap';

const MindMapNode = ({ data, selected, id }: NodeProps<MindMapNodeData>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const [content, setContent] = useState(data.content || '');
  const labelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { updateNode, deleteNode } = useMindMapStore();

  useEffect(() => {
    if (isEditing && labelRef.current) {
      labelRef.current.focus();
      // Select all text when entering edit mode
      const range = document.createRange();
      range.selectNodeContents(labelRef.current);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [isEditing]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleSave = useCallback(() => {
    setIsEditing(false);
    if (label !== data.label || content !== data.content) {
      updateNode(id, { label, content });
    }
  }, [id, label, content, data.label, data.content, updateNode]);

  const handleDelete = useCallback(() => {
    const confirmDelete = window.confirm('Are you sure you want to delete this node?');
    if (confirmDelete) {
      deleteNode(id);
    }
  }, [id, deleteNode]);
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setLabel(data.label);
      setContent(data.content || '');
    }
    e.stopPropagation(); // Prevent ReactFlow shortcuts while editing
  }, [handleSave, data.label, data.content]);

  return (
    <div 
      className={`mindmap-node group relative ${
        selected ? 'mindmap-node-selected' : isEditing ? 'mindmap-node-editing' : 'mindmap-node-default'
      }`}
      draggable={!isEditing}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        className="mindmap-handle"
        style={{
          opacity: 1,
          background: '#60a5fa',
          border: '2px solid white',
          width: '12px',
          height: '12px',
          top: -8,
          borderRadius: '6px',
          cursor: 'crosshair',
          zIndex: 50,
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        isValidConnection={(connection) => {
          return connection.source !== id;
        }}
      />
      
      <div className="mindmap-node-tools">
        {!isEditing ? (
          <>
            <button 
              onClick={handleEdit} 
              className="mindmap-node-tool-button" 
              title="Edit node"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            <button 
              onClick={handleDelete} 
              className="mindmap-node-tool-button hover:text-red-400" 
              title="Delete node"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button 
            onClick={handleSave} 
            className="mindmap-node-tool-button hover:text-green-400" 
            title="Save changes"
          >
            <CheckIcon className="w-4 h-4" />
          </button>
        )}
      </div>      <div className="mindmap-node-content space-y-2">
        <div
          ref={labelRef}
          contentEditable={isEditing}
          onKeyDown={handleKeyDown}
          onBlur={(e) => setLabel(e.currentTarget.textContent || '')}
          className={`font-medium text-gray-100 min-h-[24px] ${
            isEditing ? 'bg-gray-700/50 px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-500/50' : ''
          }`}
          suppressContentEditableWarning
          data-placeholder="Enter title"
        >
          {label}
        </div>
        
        {isEditing ? (
          <div
            ref={contentRef}
            contentEditable
            onKeyDown={handleKeyDown}
            onBlur={(e) => setContent(e.currentTarget.textContent || '')}
            className="text-sm text-gray-300 min-h-[20px] bg-gray-700/50 px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            suppressContentEditableWarning
            data-placeholder="Add notes (optional)"
          >
            {content}
          </div>
        ) : content ? (
          <div className="text-sm text-gray-400">
            {content}
          </div>
        ) : null}

        {data.tags && data.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {data.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 text-xs rounded-full bg-blue-900/50 text-blue-200 border border-blue-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="mindmap-handle"
        style={{
          opacity: 1,
          background: '#60a5fa',
          border: '2px solid white',
          width: '12px',
          height: '12px',
          bottom: -8,
          borderRadius: '6px',
          cursor: 'crosshair',
          zIndex: 50,
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        isValidConnection={(connection) => {
          return connection.target !== id;
        }}
      />
    </div>
  );
};

export default memo(MindMapNode);
