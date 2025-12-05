import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import {
  CheckSquare,
  HelpCircle,
  Calendar,
  List,
  ChevronDown,
  Folder,
  Table,
  Calculator,
  MousePointer,
  X,
  Search,
} from 'lucide-react';
import { BLOCK_LIBRARY, type BlockMetadata } from '../types/BlockTypes';

interface BlockLibraryMenuProps {
  editor: Editor;
  onClose: () => void;
  position?: { top: number; left: number };
}

const BLOCK_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  CheckSquare,
  HelpCircle,
  Calendar,
  List,
  ChevronDown,
  Folder,
  Table,
  Calculator,
  MousePointer,
};

const CATEGORY_COLORS = {
  interactive: 'bg-purple-100 text-purple-700 border-purple-300',
  content: 'bg-blue-100 text-blue-700 border-blue-300',
  utility: 'bg-green-100 text-green-700 border-green-300',
};

const BlockLibraryMenu: React.FC<BlockLibraryMenuProps> = ({ editor, onClose, position }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredBlocks = BLOCK_LIBRARY.filter((block) => {
    const matchesSearch =
      block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      block.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || block.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const insertBlock = (block: BlockMetadata) => {
    // Get default attributes based on block type
    const getDefaultAttrs = () => {
      switch (block.id) {
        case 'checklist':
          return {
            title: 'My Checklist',
            items: [
              { id: '1', text: 'Item 1', checked: false },
              { id: '2', text: 'Item 2', checked: false },
            ],
            allowUserEdit: true,
          };
        case 'quiz':
          return {
            question: 'What is the capital of France?',
            options: [
              { id: '1', text: 'Paris', isCorrect: true },
              { id: '2', text: 'London', isCorrect: false },
              { id: '3', text: 'Berlin', isCorrect: false },
            ],
            explanation: 'Paris is the capital and largest city of France.',
            showExplanation: true,
          };
        case 'timeline':
          return {
            title: 'Timeline',
            steps: [
              { id: '1', title: 'Step 1', description: 'First step', date: '2024' },
              { id: '2', title: 'Step 2', description: 'Second step', date: '2025' },
            ],
            orientation: 'vertical',
          };
        case 'stepGuide':
          return {
            title: 'Step-by-Step Guide',
            steps: [
              { id: '1', title: 'First Step', content: 'Start here', imageUrl: '' },
              { id: '2', title: 'Second Step', content: 'Continue with this', imageUrl: '' },
            ],
            showNumbers: true,
          };
        case 'collapsible':
          return {
            title: 'Click to expand',
            content: 'This is the collapsible content.',
            defaultOpen: false,
          };
        case 'tabs':
          return {
            tabs: [
              { id: '1', label: 'Tab 1', content: 'Content for tab 1' },
              { id: '2', label: 'Tab 2', content: 'Content for tab 2' },
            ],
            activeTab: '1',
          };
        case 'comparison':
          return {
            title: 'Comparison Table',
            columns: [
              { id: '1', header: 'Feature', cells: ['Price', 'Support', 'Users'] },
              { id: '2', header: 'Option A', cells: ['$10/mo', '24/7', 'Unlimited'] },
              { id: '3', header: 'Option B', cells: ['$20/mo', 'Email', '100'] },
            ],
            rowHeaders: ['Price', 'Support', 'Users'],
          };
        case 'calculator':
          return {
            title: 'Tuition Calculator',
            description: 'Calculate your estimated tuition costs',
            fields: [
              {
                id: '1',
                label: 'Tuition per year',
                type: 'number',
                defaultValue: 30000,
                min: 0,
                max: 100000,
                step: 1000,
              },
              {
                id: '2',
                label: 'Number of years',
                type: 'number',
                defaultValue: 4,
                min: 1,
                max: 8,
                step: 1,
              },
            ],
            formula: 'field_1 * field_2',
            resultLabel: 'Total Cost',
            resultUnit: '$',
          };
        case 'cta':
          return {
            title: 'Ready to get started?',
            description: 'Join thousands of students finding their perfect university match.',
            buttonText: 'Get Started',
            buttonUrl: '/signup',
            backgroundColor: '#3b82f6',
            textColor: '#ffffff',
            alignment: 'center',
            size: 'medium',
          };
        default:
          return {};
      }
    };

    // Insert the block using insertContent with proper node type
    const attrs = getDefaultAttrs();
    
    editor
      .chain()
      .focus()
      .insertContent({
        type: block.id,
        attrs,
      })
      .run();

    onClose();
  };

  const menuStyle = position
    ? {
        position: 'fixed' as const,
        top: `${Math.min(position.top, window.innerHeight - 650)}px`,
        left: `${Math.min(position.left, window.innerWidth - 650)}px`,
        maxHeight: '500px',
      }
    : {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        position: 'fixed' as const,
        maxHeight: '500px',
      };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-20 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu */}
      <div
        className="fixed z-50 bg-white rounded-lg shadow-2xl border-2 border-gray-300 w-[600px] overflow-hidden"
        style={menuStyle}
      >
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-900">Block Library</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-200 rounded text-gray-600"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search blocks..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          {/* Category filters */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === null
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedCategory('interactive')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'interactive'
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              }`}
            >
              Interactive
            </button>
            <button
              onClick={() => setSelectedCategory('content')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'content'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              Content
            </button>
            <button
              onClick={() => setSelectedCategory('utility')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'utility'
                  ? 'bg-green-600 text-white'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              Utility
            </button>
          </div>
        </div>

        {/* Block list */}
        <div className="overflow-y-auto max-h-[440px] p-2">
          {filteredBlocks.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg font-medium">No blocks found</p>
              <p className="text-sm mt-1">Try a different search term or category</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {filteredBlocks.map((block) => {
                const Icon = BLOCK_ICONS[block.icon];
                return (
                  <button
                    key={block.id}
                    onClick={() => insertBlock(block)}
                    className="flex flex-col items-start gap-2 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors">
                        {Icon && <Icon className="w-5 h-5 text-gray-700 group-hover:text-blue-600" />}
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border ${
                          CATEGORY_COLORS[block.category]
                        }`}
                      >
                        {block.category}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {block.name}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">{block.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-600">
          <p>
            💡 <strong>Tip:</strong> Type <code className="bg-gray-200 px-1 rounded">/</code>{' '}
            followed by a block name to quickly insert blocks
          </p>
        </div>
      </div>
    </>
  );
};

export default BlockLibraryMenu;
