import React, { useState } from 'react';
import { Folder } from 'lucide-react';
import type { TabsAttributes } from '../types/BlockTypes';

interface RenderTabsProps {
  attrs: TabsAttributes;
}

const RenderTabs: React.FC<RenderTabsProps> = ({ attrs }) => {
  const [activeTab, setActiveTab] = useState(attrs.activeTab || attrs.tabs[0]?.id);

  const currentTab = attrs.tabs.find((tab) => tab.id === activeTab) || attrs.tabs[0];

  return (
    <div className="tabs-renderer my-8 p-6 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-200 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Folder className="w-7 h-7 text-cyan-600" />
        <h3 className="text-2xl font-bold text-gray-900">Content Tabs</h3>
      </div>

      {/* Tab headers */}
      <div
        className="flex gap-2 border-b-2 border-cyan-200 mb-6 overflow-x-auto"
        role="tablist"
      >
        {attrs.tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            className={`px-6 py-3 font-semibold transition-all whitespace-nowrap relative ${
              activeTab === tab.id
                ? 'text-cyan-700 bg-white rounded-t-lg'
                : 'text-gray-600 hover:text-gray-900 hover:bg-cyan-50 rounded-t-lg'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-600" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {currentTab && (
        <div
          id={`tabpanel-${currentTab.id}`}
          role="tabpanel"
          className="p-6 bg-white rounded-lg border-2 border-cyan-200 shadow-sm animate-fadeIn"
        >
          <div className="prose prose-sm max-w-none text-gray-700">
            {currentTab.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-3 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default RenderTabs;
