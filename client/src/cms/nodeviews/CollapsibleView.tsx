import React from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { ChevronDown, Trash2, GripVertical } from 'lucide-react';
import type { CollapsibleAttributes } from '../types/BlockTypes';

interface CollapsibleViewProps {
  node: {
    attrs: CollapsibleAttributes;
  };
  updateAttributes: (attrs: Partial<CollapsibleAttributes>) => void;
  deleteNode: () => void;
  selected: boolean;
}

const CollapsibleView: React.FC<CollapsibleViewProps> = ({
  node,
  updateAttributes,
  deleteNode,
  selected,
}) => {
  const { title, content, defaultOpen } = node.attrs;

  return (
    <NodeViewWrapper
      className={`collapsible-node-view ${selected ? 'selected' : ''}`}
      data-drag-handle
    >
      <div className="relative group border-2 border-gray-200 rounded-lg p-4 bg-white hover:border-amber-300 transition-colors">
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
          <GripVertical className="w-5 h-5 text-gray-400" />
        </div>

        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={deleteNode}
            className="p-1 hover:bg-red-100 rounded text-red-600"
            title="Delete block"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <ChevronDown className="w-6 h-6 text-amber-600" />
            <input
              type="text"
              value={title}
              onChange={(e) => updateAttributes({ title: e.target.value })}
              className="flex-1 text-lg font-semibold border-b-2 border-transparent hover:border-gray-300 focus:border-amber-500 focus:outline-none px-2 py-1"
              placeholder="Collapsible title..."
            />
          </div>

          <div className="ml-8 mb-4">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={defaultOpen}
                onChange={(e) => updateAttributes({ defaultOpen: e.target.checked })}
                className="rounded border-gray-300"
              />
              Open by default
            </label>
          </div>

          <div className="ml-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <label className="block text-xs font-medium text-gray-500 mb-2">
              Collapsible Content:
            </label>
            <textarea
              value={content}
              onChange={(e) => updateAttributes({ content: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              placeholder="Content that will be hidden/shown..."
              rows={5}
            />
          </div>

          <div className="mt-3 ml-2 p-3 bg-amber-50 rounded-lg border border-amber-200 text-sm text-amber-800">
            <strong>Preview:</strong> Users will click the title to expand/collapse this
            content on the public page.
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export default CollapsibleView;
