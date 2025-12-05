import React, { useState } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { Folder, Plus, Trash2, GripVertical } from 'lucide-react';
import type { TabsAttributes, TabItem } from '../types/BlockTypes';

interface TabsViewProps {
  node: {
    attrs: TabsAttributes;
  };
  updateAttributes: (attrs: Partial<TabsAttributes>) => void;
  deleteNode: () => void;
  selected: boolean;
}

const TabsView: React.FC<TabsViewProps> = ({
  node,
  updateAttributes,
  deleteNode,
  selected,
}) => {
  const { tabs, activeTab } = node.attrs;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editField, setEditField] = useState<'label' | 'content' | null>(null);

  const currentTab = tabs.find((tab) => tab.id === activeTab) || tabs[0];

  const handleTabChange = (id: string, field: keyof TabItem, value: string) => {
    const updatedTabs = tabs.map((tab) =>
      tab.id === id ? { ...tab, [field]: value } : tab
    );
    updateAttributes({ tabs: updatedTabs });
  };

  const addTab = () => {
    const newTab: TabItem = {
      id: Date.now().toString(),
      label: 'New Tab',
      content: 'Tab content here...',
    };
    updateAttributes({ tabs: [...tabs, newTab], activeTab: newTab.id });
    setEditingId(newTab.id);
    setEditField('label');
  };

  const removeTab = (id: string) => {
    if (tabs.length <= 1) {
      alert('Tabs block must have at least 1 tab');
      return;
    }
    const updatedTabs = tabs.filter((tab) => tab.id !== id);
    const newActiveTab = activeTab === id ? updatedTabs[0].id : activeTab;
    updateAttributes({ tabs: updatedTabs, activeTab: newActiveTab });
  };

  const setActiveTab = (id: string) => {
    updateAttributes({ activeTab: id });
  };

  return (
    <NodeViewWrapper
      className={`tabs-node-view ${selected ? 'selected' : ''}`}
      data-drag-handle
    >
      <div className="relative group border-2 border-gray-200 rounded-lg p-4 bg-white hover:border-cyan-300 transition-colors">
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

        <div className="flex items-center gap-2 mb-4 pt-6">
          <Folder className="w-6 h-6 text-cyan-600" />
          <span className="text-xl font-bold text-gray-900">Tabs Block</span>
        </div>

        <div className="ml-2">
          <div className="flex gap-2 border-b-2 border-gray-200 mb-4 overflow-x-auto">
            {tabs.map((tab) => (
              <div key={tab.id} className="relative group/tab flex-shrink-0">
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 font-medium transition-colors relative ${
                    activeTab === tab.id
                      ? 'text-cyan-600 border-b-2 border-cyan-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {editingId === tab.id && editField === 'label' ? (
                    <input
                      type="text"
                      value={tab.label}
                      onChange={(e) => handleTabChange(tab.id, 'label', e.target.value)}
                      onBlur={() => {
                        setEditingId(null);
                        setEditField(null);
                      }}
                      autoFocus
                      className="w-24 border border-gray-300 rounded px-2 py-1"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        setEditingId(tab.id);
                        setEditField('label');
                      }}
                    >
                      {tab.label}
                    </span>
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTab(tab.id);
                  }}
                  className="absolute -top-1 -right-1 p-0.5 bg-red-100 hover:bg-red-200 rounded-full text-red-600 opacity-0 group-hover/tab:opacity-100 transition-opacity"
                  title="Remove tab"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button
              onClick={addTab}
              className="px-3 py-2 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 rounded transition-colors flex-shrink-0"
              title="Add tab"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {currentTab && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <label className="block text-xs font-medium text-gray-500 mb-2">
                Content for &quot;{currentTab.label}&quot;:
              </label>
              <textarea
                value={currentTab.content}
                onChange={(e) =>
                  handleTabChange(currentTab.id, 'content', e.target.value)
                }
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                placeholder="Tab content..."
                rows={6}
              />
            </div>
          )}
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export default TabsView;
