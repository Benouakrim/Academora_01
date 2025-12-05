import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Plus, Save, Eye } from 'lucide-react';

// Import custom extensions
import { ChecklistExtension } from './extensions/checklist';
import { QuizExtension } from './extensions/quiz';
import { TimelineExtension } from './extensions/timeline';
import { StepGuideExtension } from './extensions/stepGuide';
import { CollapsibleExtension } from './extensions/collapsible';
import { TabsExtension } from './extensions/tabs';
import { ComparisonExtension } from './extensions/comparison';
import { CalculatorExtension } from './extensions/calculator';
import { CtaExtension } from './extensions/cta';

// Import menu
import BlockLibraryMenu from './menus/BlockLibraryMenu';

interface TiptapEditorProps {
  initialContent?: Record<string, unknown>;
  onSave?: (content: Record<string, unknown>) => void;
  onPreview?: (content: Record<string, unknown>) => void;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  initialContent,
  onSave,
  onPreview,
}) => {
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return 'Heading...';
          }
          return 'Start writing or type "/" to insert a block...';
        },
      }),
      // Custom block extensions
      ChecklistExtension,
      QuizExtension,
      TimelineExtension,
      StepGuideExtension,
      CollapsibleExtension,
      TabsExtension,
      ComparisonExtension,
      CalculatorExtension,
      CtaExtension,
    ],
    content: initialContent || {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: 'Your Article Title' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Start writing your article here. Type "/" to insert interactive blocks.',
            },
          ],
        },
      ],
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-lg max-w-none focus:outline-none min-h-[500px] px-8 py-6',
      },
    },
    onUpdate: ({ editor: ed }) => {
      // Check for slash command
      const { state } = ed;
      const { selection } = state;
      const { $from } = selection;
      const text = $from.parent.textContent;
      
      if (text.endsWith('/') && !showBlockMenu) {
        setTimeout(() => {
          const { view } = ed;
          const coords = view.coordsAtPos(selection.from);
          setMenuPosition({
            top: coords.top + window.scrollY + 20,
            left: coords.left + window.scrollX,
          });
          setShowBlockMenu(true);
          
          // Remove the "/" character
          ed.commands.deleteRange({
            from: selection.from - 1,
            to: selection.from,
          });
        }, 0);
      }
    },
  });

  // Handle Escape key to close menu
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showBlockMenu) {
        setShowBlockMenu(false);
        event.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showBlockMenu]);

  const handleSave = () => {
    if (editor && onSave) {
      const json = editor.getJSON();
      onSave(json);
    }
  };

  const handlePreview = () => {
    if (editor && onPreview) {
      const json = editor.getJSON();
      onPreview(json);
    }
  };

  const openBlockMenu = () => {
    if (editor) {
      const { view } = editor;
      const { selection } = view.state;
      const coords = view.coordsAtPos(selection.from);
      setMenuPosition({
        top: coords.top + window.scrollY + 20,
        left: coords.left + window.scrollX,
      });
      setShowBlockMenu(true);
    }
  };

  if (!editor) {
    return <div className="p-8 text-center text-gray-500">Loading editor...</div>;
  }

  return (
    <div className="tiptap-editor-container">
      {/* Toolbar */}
      <div className="sticky top-0 z-20 bg-white border-b-2 border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={openBlockMenu}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                title="Insert block"
              >
                <Plus className="w-5 h-5" />
                <span>Add Block</span>
              </button>

              <div className="h-6 w-px bg-gray-300 mx-2" />

              {/* Text formatting buttons */}
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`px-3 py-2 rounded font-bold ${
                  editor.isActive('bold')
                    ? 'bg-gray-200 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Bold"
              >
                B
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`px-3 py-2 rounded italic ${
                  editor.isActive('italic')
                    ? 'bg-gray-200 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Italic"
              >
                I
              </button>
              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`px-3 py-2 rounded font-semibold ${
                  editor.isActive('heading', { level: 2 })
                    ? 'bg-gray-200 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Heading 2"
              >
                H2
              </button>
              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`px-3 py-2 rounded font-semibold text-sm ${
                  editor.isActive('heading', { level: 3 })
                    ? 'bg-gray-200 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Heading 3"
              >
                H3
              </button>
              <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`px-3 py-2 rounded ${
                  editor.isActive('bulletList')
                    ? 'bg-gray-200 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Bullet list"
              >
                •
              </button>
              <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`px-3 py-2 rounded ${
                  editor.isActive('orderedList')
                    ? 'bg-gray-200 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Numbered list"
              >
                1.
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePreview}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Eye className="w-5 h-5" />
                <span>Preview</span>
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="w-5 h-5" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Editor content */}
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg mt-6 mb-12">
        <EditorContent editor={editor} />
      </div>

      {/* Block Library Menu */}
      {showBlockMenu && editor && (
        <BlockLibraryMenu
          editor={editor}
          onClose={() => setShowBlockMenu(false)}
          position={menuPosition}
        />
      )}

      {/* Custom styles */}
      <style>{`
        .tiptap-editor-container {
          min-height: 100vh;
          background-color: #f9fafb;
        }

        .ProseMirror {
          outline: none;
        }

        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }

        .ProseMirror .checklist-node-view.selected,
        .ProseMirror .quiz-node-view.selected,
        .ProseMirror .timeline-node-view.selected,
        .ProseMirror .step-guide-node-view.selected,
        .ProseMirror .collapsible-node-view.selected,
        .ProseMirror .tabs-node-view.selected,
        .ProseMirror .comparison-node-view.selected,
        .ProseMirror .calculator-node-view.selected,
        .ProseMirror .cta-node-view.selected {
          outline: 3px solid #3b82f6;
          outline-offset: 2px;
          border-radius: 8px;
        }

        /* Ensure blocks have spacing */
        .ProseMirror > * + * {
          margin-top: 1rem;
        }

        /* Style headings */
        .ProseMirror h1 {
          font-size: 2.25rem;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 1rem;
        }

        .ProseMirror h2 {
          font-size: 1.875rem;
          font-weight: 700;
          line-height: 1.3;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }

        .ProseMirror h3 {
          font-size: 1.5rem;
          font-weight: 600;
          line-height: 1.4;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5rem;
          margin: 1rem 0;
        }

        .ProseMirror li {
          margin: 0.5rem 0;
        }

        .ProseMirror strong {
          font-weight: 700;
        }

        .ProseMirror em {
          font-style: italic;
        }

        .ProseMirror code {
          background-color: #f3f4f6;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-family: 'Courier New', monospace;
          font-size: 0.875em;
        }
      `}</style>
    </div>
  );
};

export default TiptapEditor;
