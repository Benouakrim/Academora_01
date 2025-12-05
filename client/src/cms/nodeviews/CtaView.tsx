import React from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { MousePointer, Trash2, GripVertical } from 'lucide-react';
import type { CtaAttributes } from '../types/BlockTypes';

interface CtaViewProps {
  node: {
    attrs: CtaAttributes;
  };
  updateAttributes: (attrs: Partial<CtaAttributes>) => void;
  deleteNode: () => void;
  selected: boolean;
}

const CtaView: React.FC<CtaViewProps> = ({ node, updateAttributes, deleteNode, selected }) => {
  const {
    title,
    description,
    buttonText,
    buttonUrl,
    backgroundColor,
    textColor,
    alignment,
    size,
  } = node.attrs;

  const sizeClasses = {
    small: 'py-8 px-4',
    medium: 'py-12 px-6',
    large: 'py-16 px-8',
  };

  return (
    <NodeViewWrapper className={`cta-node-view ${selected ? 'selected' : ''}`} data-drag-handle>
      <div className="relative group border-2 border-gray-200 rounded-lg overflow-hidden hover:border-pink-300 transition-colors">
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab z-10">
          <GripVertical className="w-5 h-5 text-gray-400 drop-shadow" />
        </div>

        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button
            onClick={deleteNode}
            className="p-1 hover:bg-red-100 rounded text-red-600"
            title="Delete block"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div
          className={`${sizeClasses[size]} text-${alignment}`}
          style={{
            backgroundColor: backgroundColor,
            color: textColor,
          }}
        >
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 justify-center mb-4 opacity-50">
              <MousePointer className="w-5 h-5" />
              <span className="text-sm font-medium">CTA Block</span>
            </div>

            <input
              type="text"
              value={title}
              onChange={(e) => updateAttributes({ title: e.target.value })}
              className="w-full text-3xl font-bold mb-4 bg-transparent border-b-2 border-transparent hover:border-current focus:border-current focus:outline-none px-2 py-1 text-center"
              placeholder="CTA Title..."
              style={{ color: textColor }}
            />

            <textarea
              value={description}
              onChange={(e) => updateAttributes({ description: e.target.value })}
              className="w-full text-lg mb-6 bg-transparent border-b border-transparent hover:border-current focus:border-current focus:outline-none px-2 py-1 resize-none text-center"
              placeholder="CTA Description..."
              rows={2}
              style={{ color: textColor }}
            />

            <div className="flex justify-center mb-6">
              <input
                type="text"
                value={buttonText}
                onChange={(e) => updateAttributes({ buttonText: e.target.value })}
                className="px-6 py-3 font-semibold rounded-lg border-2 border-dashed text-center"
                placeholder="Button Text..."
                style={{
                  backgroundColor: textColor,
                  color: backgroundColor,
                  borderColor: textColor,
                }}
              />
            </div>

            <input
              type="text"
              value={buttonUrl}
              onChange={(e) => updateAttributes({ buttonUrl: e.target.value })}
              className="w-full text-sm bg-transparent border-b border-transparent hover:border-current focus:border-current focus:outline-none px-2 py-1 text-center opacity-70"
              placeholder="Button URL..."
              style={{ color: textColor }}
            />
          </div>
        </div>

        <div className="bg-gray-50 p-4 border-t-2 border-gray-200">
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Alignment</label>
              <select
                value={alignment}
                onChange={(e) =>
                  updateAttributes({ alignment: e.target.value as 'left' | 'center' | 'right' })
                }
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Size</label>
              <select
                value={size}
                onChange={(e) =>
                  updateAttributes({ size: e.target.value as 'small' | 'medium' | 'large' })
                }
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Background Color
              </label>
              <div className="flex gap-1">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => updateAttributes({ backgroundColor: e.target.value })}
                  className="w-10 h-8 rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => updateAttributes({ backgroundColor: e.target.value })}
                  className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Text Color</label>
              <div className="flex gap-1">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => updateAttributes({ textColor: e.target.value })}
                  className="w-10 h-8 rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={textColor}
                  onChange={(e) => updateAttributes({ textColor: e.target.value })}
                  className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export default CtaView;
