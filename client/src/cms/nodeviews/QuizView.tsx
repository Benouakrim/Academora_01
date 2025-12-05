import React, { useState } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { HelpCircle, Plus, Trash2, GripVertical, CheckCircle, XCircle } from 'lucide-react';
import type { QuizAttributes, QuizOption } from '../types/BlockTypes';

interface QuizViewProps {
  node: {
    attrs: QuizAttributes;
  };
  updateAttributes: (attrs: Partial<QuizAttributes>) => void;
  deleteNode: () => void;
  selected: boolean;
}

const QuizView: React.FC<QuizViewProps> = ({
  node,
  updateAttributes,
  deleteNode,
  selected,
}) => {
  const { question, options, explanation, showExplanation } = node.attrs;
  const [editingOptionId, setEditingOptionId] = useState<string | null>(null);

  const handleQuestionChange = (newQuestion: string) => {
    updateAttributes({ question: newQuestion });
  };

  const handleOptionTextChange = (id: string, newText: string) => {
    const updatedOptions = options.map((opt) =>
      opt.id === id ? { ...opt, text: newText } : opt
    );
    updateAttributes({ options: updatedOptions });
  };

  const toggleCorrectAnswer = (id: string) => {
    const updatedOptions = options.map((opt) => ({
      ...opt,
      isCorrect: opt.id === id,
    }));
    updateAttributes({ options: updatedOptions });
  };

  const addOption = () => {
    const newOption: QuizOption = {
      id: Date.now().toString(),
      text: 'New option',
      isCorrect: false,
    };
    updateAttributes({ options: [...options, newOption] });
    setEditingOptionId(newOption.id);
  };

  const removeOption = (id: string) => {
    if (options.length <= 2) {
      alert('Quiz must have at least 2 options');
      return;
    }
    const updatedOptions = options.filter((opt) => opt.id !== id);
    updateAttributes({ options: updatedOptions });
  };

  return (
    <NodeViewWrapper
      className={`quiz-node-view ${selected ? 'selected' : ''}`}
      data-drag-handle
    >
      <div className="relative group border-2 border-gray-200 rounded-lg p-4 bg-white hover:border-purple-300 transition-colors">
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

        <div className="flex items-start gap-3 mb-4 pt-6">
          <HelpCircle className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
          <textarea
            value={question}
            onChange={(e) => handleQuestionChange(e.target.value)}
            className="flex-1 text-lg font-semibold border-b-2 border-transparent hover:border-gray-300 focus:border-purple-500 focus:outline-none px-2 py-1 resize-none"
            placeholder="Enter your question..."
            rows={2}
          />
        </div>

        <div className="space-y-3 ml-2">
          {options.map((option) => (
            <div
              key={option.id}
              className={`flex items-center gap-3 group/option p-3 rounded border-2 transition-colors ${
                option.isCorrect
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name={`quiz-${node.attrs.question}`}
                checked={option.isCorrect}
                onChange={() => toggleCorrectAnswer(option.id)}
                className="w-5 h-5 text-green-600"
                title="Mark as correct answer"
              />
              {editingOptionId === option.id ? (
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => handleOptionTextChange(option.id, e.target.value)}
                  onBlur={() => setEditingOptionId(null)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setEditingOptionId(null);
                  }}
                  autoFocus
                  className="flex-1 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              ) : (
                <span
                  onClick={() => setEditingOptionId(option.id)}
                  className="flex-1 cursor-text"
                >
                  {option.text}
                </span>
              )}
              {option.isCorrect ? (
                <CheckCircle className="w-5 h-5 text-green-600" aria-label="Correct answer" />
              ) : (
                <XCircle className="w-5 h-5 text-gray-400" aria-label="Incorrect answer" />
              )}
              <button
                onClick={() => removeOption(option.id)}
                className="opacity-0 group-hover/option:opacity-100 p-1 hover:bg-red-100 rounded text-red-600 transition-opacity"
                title="Remove option"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addOption}
          className="mt-3 flex items-center gap-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-3 py-2 rounded transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Add option</span>
        </button>

        <div className="mt-4 pt-3 border-t border-gray-200 space-y-3">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={showExplanation}
              onChange={(e) => updateAttributes({ showExplanation: e.target.checked })}
              className="rounded border-gray-300"
            />
            Show explanation after answer
          </label>

          {showExplanation && (
            <textarea
              value={explanation}
              onChange={(e) => updateAttributes({ explanation: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              placeholder="Explain the correct answer..."
              rows={3}
            />
          )}
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export default QuizView;
