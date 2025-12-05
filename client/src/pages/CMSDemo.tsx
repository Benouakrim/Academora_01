import React, { useState } from 'react';
import TiptapEditor from '../cms/TiptapEditor';
import { convertTiptapJSONToStaticHTML } from '../cms/convertToHTML';
import { hydrateInteractiveBlocks } from '../cms/hydrateBlocks';
import { Eye, Code, Sparkles } from 'lucide-react';

const CMSDemo: React.FC = () => {
  const [editorContent, setEditorContent] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'editor' | 'preview' | 'html'>('editor');
  const [staticHTML, setStaticHTML] = useState<string>('');

  const handleSave = (content: any) => {
    setEditorContent(content);
    const html = convertTiptapJSONToStaticHTML(content);
    setStaticHTML(html);
    alert('Content saved! Check the preview tab to see the result.');
  };

  const handlePreview = (content: any) => {
    setEditorContent(content);
    const html = convertTiptapJSONToStaticHTML(content);
    setStaticHTML(html);
    setViewMode('preview');
  };

  // Hydrate blocks when switching to preview
  React.useEffect(() => {
    if (viewMode === 'preview' && staticHTML) {
      const container = document.getElementById('preview-container');
      if (container) {
        setTimeout(() => {
          hydrateInteractiveBlocks(container);
        }, 100);
      }
    }
  }, [viewMode, staticHTML]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Academora CMS Demo</h1>
          </div>
          <p className="text-blue-100 text-lg">
            Interactive Content Management System with Tiptap v2/v3
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setViewMode('editor')}
              className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all ${
                viewMode === 'editor'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              Editor
            </button>
            <button
              onClick={() => setViewMode('preview')}
              disabled={!staticHTML}
              className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all ${
                viewMode === 'preview'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              <Eye className="w-5 h-5" />
              Preview (Hydrated)
            </button>
            <button
              onClick={() => setViewMode('html')}
              disabled={!staticHTML}
              className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all ${
                viewMode === 'html'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              <Code className="w-5 h-5" />
              HTML (SEO)
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {viewMode === 'editor' && (
          <div>
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h2 className="text-lg font-bold text-blue-900 mb-2">
                📝 Getting Started
              </h2>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Click the <strong>Add Block</strong> button to insert interactive widgets</li>
                <li>• Type <code className="bg-blue-100 px-1 rounded">/</code> to quickly insert blocks</li>
                <li>• Click on any block to edit its content</li>
                <li>• Use the toolbar for text formatting</li>
                <li>• Click <strong>Save</strong> to generate HTML, then view the <strong>Preview</strong> tab</li>
              </ul>
            </div>
            <TiptapEditor onSave={handleSave} onPreview={handlePreview} />
          </div>
        )}

        {viewMode === 'preview' && staticHTML && (
          <div>
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h2 className="text-lg font-bold text-green-900 mb-2">
                ✨ Interactive Preview
              </h2>
              <p className="text-sm text-green-800">
                This is the hydrated version with full interactivity. All blocks are now React
                components with state management, localStorage persistence, and event handling.
              </p>
            </div>
            <div
              id="preview-container"
              className="prose prose-lg max-w-none bg-white p-8 rounded-lg shadow-lg"
              dangerouslySetInnerHTML={{ __html: staticHTML }}
            />
          </div>
        )}

        {viewMode === 'html' && staticHTML && (
          <div>
            <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h2 className="text-lg font-bold text-purple-900 mb-2">
                🔍 SEO-Friendly HTML
              </h2>
              <p className="text-sm text-purple-800 mb-2">
                This HTML is fully crawlable by search engines. All text content is present in the
                markup, and interactive blocks are marked with <code className="bg-purple-100 px-1 rounded">data-*</code> attributes.
              </p>
              <p className="text-sm text-purple-800">
                The <code className="bg-purple-100 px-1 rounded">script</code> tags contain JSON configurations that are read during hydration.
              </p>
            </div>
            <div className="bg-gray-900 text-green-400 p-6 rounded-lg overflow-auto">
              <pre className="text-sm">
                <code>{staticHTML}</code>
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="max-w-7xl mx-auto px-4 py-8 mt-12 border-t border-gray-200">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-blue-50 rounded-lg">
            <h3 className="font-bold text-blue-900 mb-2">🎯 Editor Features</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 9 custom interactive blocks</li>
              <li>• Drag & drop reordering</li>
              <li>• Real-time editing</li>
              <li>• Rich text formatting</li>
              <li>• Slash commands</li>
            </ul>
          </div>
          <div className="p-6 bg-green-50 rounded-lg">
            <h3 className="font-bold text-green-900 mb-2">⚡ Interactive Widgets</h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Checklist with progress</li>
              <li>• Quiz with scoring</li>
              <li>• Timeline (vertical/horizontal)</li>
              <li>• Step-by-step guides</li>
              <li>• Calculators with formulas</li>
            </ul>
          </div>
          <div className="p-6 bg-purple-50 rounded-lg">
            <h3 className="font-bold text-purple-900 mb-2">🔍 SEO Ready</h3>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• Static HTML generation</li>
              <li>• All content crawlable</li>
              <li>• Progressive enhancement</li>
              <li>• Client-side hydration</li>
              <li>• Works without JavaScript</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CMSDemo;
