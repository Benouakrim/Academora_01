import React, { useState, useEffect } from 'react';
import { CheckSquare } from 'lucide-react';
import type { ChecklistAttributes, ChecklistItem } from '../types/BlockTypes';

interface RenderChecklistProps {
  attrs: ChecklistAttributes;
  blockId: string;
}

const RenderChecklist: React.FC<RenderChecklistProps> = ({ attrs, blockId }) => {
  // Initialize state with saved data if available
  const getInitialItems = () => {
    if (attrs.allowUserEdit) {
      const saved = localStorage.getItem(`checklist-${blockId}`);
      if (saved) {
        try {
          return JSON.parse(saved) as ChecklistItem[];
        } catch (e) {
          console.error('Failed to parse saved checklist:', e);
        }
      }
    }
    return attrs.items;
  };

  const [items, setItems] = useState<ChecklistItem[]>(getInitialItems);

  // Save state to localStorage
  useEffect(() => {
    if (attrs.allowUserEdit) {
      localStorage.setItem(`checklist-${blockId}`, JSON.stringify(items));
    }
  }, [items, blockId, attrs.allowUserEdit]);

  const toggleItem = (id: string) => {
    if (!attrs.allowUserEdit) return;
    
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const progress = items.length > 0
    ? Math.round((items.filter((item) => item.checked).length / items.length) * 100)
    : 0;

  return (
    <div className="checklist-renderer my-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <CheckSquare className="w-7 h-7 text-blue-600" />
          <h3 className="text-2xl font-bold text-gray-900">{attrs.title}</h3>
        </div>
        {attrs.allowUserEdit && (
          <div className="text-sm font-medium text-blue-700">
            {progress}% Complete
          </div>
        )}
      </div>

      {attrs.allowUserEdit && (
        <div className="mb-4 bg-white rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              attrs.allowUserEdit
                ? 'cursor-pointer hover:bg-white hover:shadow-sm'
                : 'bg-white'
            } ${item.checked ? 'opacity-75' : ''}`}
            onClick={() => toggleItem(item.id)}
            role={attrs.allowUserEdit ? 'button' : undefined}
            tabIndex={attrs.allowUserEdit ? 0 : undefined}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                toggleItem(item.id);
              }
            }}
          >
            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => toggleItem(item.id)}
              disabled={!attrs.allowUserEdit}
              className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
              aria-label={item.text}
            />
            <span
              className={`flex-1 text-gray-800 ${
                item.checked ? 'line-through text-gray-500' : ''
              }`}
            >
              {item.text}
            </span>
          </li>
        ))}
      </ul>

      {!attrs.allowUserEdit && (
        <p className="mt-4 text-xs text-gray-500 italic">
          This is a read-only checklist
        </p>
      )}
    </div>
  );
};

export default RenderChecklist;
