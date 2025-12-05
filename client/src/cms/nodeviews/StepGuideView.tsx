import React, { useState } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { List, Plus, Trash2, GripVertical, Image } from 'lucide-react';
import type { StepGuideAttributes, GuideStep } from '../types/BlockTypes';

interface StepGuideViewProps {
  node: {
    attrs: StepGuideAttributes;
  };
  updateAttributes: (attrs: Partial<StepGuideAttributes>) => void;
  deleteNode: () => void;
  selected: boolean;
}

const StepGuideView: React.FC<StepGuideViewProps> = ({
  node,
  updateAttributes,
  deleteNode,
  selected,
}) => {
  const { title, steps, showNumbers } = node.attrs;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editField, setEditField] = useState<'title' | 'content' | 'imageUrl' | null>(null);

  const handleTitleChange = (newTitle: string) => {
    updateAttributes({ title: newTitle });
  };

  const handleStepChange = (id: string, field: keyof GuideStep, value: string) => {
    const updatedSteps = steps.map((step) =>
      step.id === id ? { ...step, [field]: value } : step
    );
    updateAttributes({ steps: updatedSteps });
  };

  const addStep = () => {
    const newStep: GuideStep = {
      id: Date.now().toString(),
      title: 'New Step',
      content: 'Add step content here...',
      imageUrl: '',
    };
    updateAttributes({ steps: [...steps, newStep] });
    setEditingId(newStep.id);
    setEditField('title');
  };

  const removeStep = (id: string) => {
    const updatedSteps = steps.filter((step) => step.id !== id);
    updateAttributes({ steps: updatedSteps });
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= steps.length) return;

    const updatedSteps = [...steps];
    [updatedSteps[index], updatedSteps[newIndex]] = [
      updatedSteps[newIndex],
      updatedSteps[index],
    ];
    updateAttributes({ steps: updatedSteps });
  };

  return (
    <NodeViewWrapper
      className={`step-guide-node-view ${selected ? 'selected' : ''}`}
      data-drag-handle
    >
      <div className="relative group border-2 border-gray-200 rounded-lg p-4 bg-white hover:border-teal-300 transition-colors">
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
          <List className="w-6 h-6 text-teal-600" />
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="flex-1 text-xl font-bold border-b-2 border-transparent hover:border-gray-300 focus:border-teal-500 focus:outline-none px-2 py-1"
            placeholder="Guide title..."
          />
        </div>

        <div className="mb-3 ml-8">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={showNumbers}
              onChange={(e) => updateAttributes({ showNumbers: e.target.checked })}
              className="rounded border-gray-300"
            />
            Show step numbers
          </label>
        </div>

        <div className="space-y-4 ml-2">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="relative group/step p-4 rounded-lg border-2 border-gray-200 hover:border-teal-300 bg-gray-50"
            >
              <div className="absolute top-2 right-2 opacity-0 group-hover/step:opacity-100 transition-opacity flex gap-1">
                <button
                  onClick={() => moveStep(index, 'up')}
                  disabled={index === 0}
                  className="p-1 hover:bg-teal-100 rounded text-teal-600 disabled:opacity-30"
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveStep(index, 'down')}
                  disabled={index === steps.length - 1}
                  className="p-1 hover:bg-teal-100 rounded text-teal-600 disabled:opacity-30"
                  title="Move down"
                >
                  ↓
                </button>
                <button
                  onClick={() => removeStep(step.id)}
                  className="p-1 hover:bg-red-100 rounded text-red-600"
                  title="Remove step"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-start gap-3">
                {showNumbers && (
                  <div className="flex-shrink-0 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                )}

                <div className="flex-1">
                  <div className="font-semibold text-lg text-gray-900 mb-2">
                    {editingId === step.id && editField === 'title' ? (
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) => handleStepChange(step.id, 'title', e.target.value)}
                        onBlur={() => {
                          setEditingId(null);
                          setEditField(null);
                        }}
                        autoFocus
                        className="w-full border border-gray-300 rounded px-2 py-1"
                      />
                    ) : (
                      <span
                        onClick={() => {
                          setEditingId(step.id);
                          setEditField('title');
                        }}
                        className="cursor-text"
                      >
                        {step.title}
                      </span>
                    )}
                  </div>

                  <div className="text-gray-600 mb-3">
                    {editingId === step.id && editField === 'content' ? (
                      <textarea
                        value={step.content}
                        onChange={(e) =>
                          handleStepChange(step.id, 'content', e.target.value)
                        }
                        onBlur={() => {
                          setEditingId(null);
                          setEditField(null);
                        }}
                        autoFocus
                        className="w-full border border-gray-300 rounded px-2 py-1 resize-none"
                        rows={3}
                      />
                    ) : (
                      <span
                        onClick={() => {
                          setEditingId(step.id);
                          setEditField('content');
                        }}
                        className="cursor-text"
                      >
                        {step.content}
                      </span>
                    )}
                  </div>

                  {step.imageUrl ? (
                    <div className="relative group/image">
                      <img
                        src={step.imageUrl}
                        alt={step.title}
                        className="w-full rounded-lg max-h-48 object-cover"
                      />
                      <button
                        onClick={() => handleStepChange(step.id, 'imageUrl', '')}
                        className="absolute top-2 right-2 p-1 bg-red-100 hover:bg-red-200 rounded text-red-600 opacity-0 group-hover/image:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Image className="w-4 h-4 text-gray-400" />
                      {editingId === step.id && editField === 'imageUrl' ? (
                        <input
                          type="text"
                          value={step.imageUrl || ''}
                          onChange={(e) =>
                            handleStepChange(step.id, 'imageUrl', e.target.value)
                          }
                          onBlur={() => {
                            setEditingId(null);
                            setEditField(null);
                          }}
                          autoFocus
                          placeholder="Image URL..."
                          className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                      ) : (
                        <button
                          onClick={() => {
                            setEditingId(step.id);
                            setEditField('imageUrl');
                          }}
                          className="text-sm text-teal-600 hover:text-teal-700"
                        >
                          Add image
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addStep}
          className="mt-3 flex items-center gap-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50 px-3 py-2 rounded transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Add step</span>
        </button>
      </div>
    </NodeViewWrapper>
  );
};

export default StepGuideView;
