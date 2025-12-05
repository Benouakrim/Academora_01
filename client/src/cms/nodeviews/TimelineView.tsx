import React, { useState } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { Calendar, Plus, Trash2, GripVertical, ArrowUpDown } from 'lucide-react';
import type { TimelineAttributes, TimelineStep } from '../types/BlockTypes';

interface TimelineViewProps {
  node: {
    attrs: TimelineAttributes;
  };
  updateAttributes: (attrs: Partial<TimelineAttributes>) => void;
  deleteNode: () => void;
  selected: boolean;
}

const TimelineView: React.FC<TimelineViewProps> = ({
  node,
  updateAttributes,
  deleteNode,
  selected,
}) => {
  const { title, steps, orientation } = node.attrs;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editField, setEditField] = useState<'title' | 'description' | 'date' | null>(null);

  const handleTitleChange = (newTitle: string) => {
    updateAttributes({ title: newTitle });
  };

  const handleStepChange = (
    id: string,
    field: keyof TimelineStep,
    value: string
  ) => {
    const updatedSteps = steps.map((step) =>
      step.id === id ? { ...step, [field]: value } : step
    );
    updateAttributes({ steps: updatedSteps });
  };

  const addStep = () => {
    const newStep: TimelineStep = {
      id: Date.now().toString(),
      title: 'New Step',
      description: 'Add description',
      date: new Date().getFullYear().toString(),
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

  const toggleOrientation = () => {
    updateAttributes({
      orientation: orientation === 'vertical' ? 'horizontal' : 'vertical',
    });
  };

  return (
    <NodeViewWrapper
      className={`timeline-node-view ${selected ? 'selected' : ''}`}
      data-drag-handle
    >
      <div className="relative group border-2 border-gray-200 rounded-lg p-4 bg-white hover:border-indigo-300 transition-colors">
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
          <GripVertical className="w-5 h-5 text-gray-400" />
        </div>

        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
          <button
            onClick={toggleOrientation}
            className="p-1 hover:bg-indigo-100 rounded text-indigo-600"
            title={`Switch to ${orientation === 'vertical' ? 'horizontal' : 'vertical'}`}
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
          <button
            onClick={deleteNode}
            className="p-1 hover:bg-red-100 rounded text-red-600"
            title="Delete block"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-4 pt-6">
          <Calendar className="w-6 h-6 text-indigo-600" />
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="flex-1 text-xl font-bold border-b-2 border-transparent hover:border-gray-300 focus:border-indigo-500 focus:outline-none px-2 py-1"
            placeholder="Timeline title..."
          />
        </div>

        <div className="text-xs text-gray-500 mb-3 ml-8">
          Orientation: <span className="font-medium">{orientation}</span>
        </div>

        <div
          className={`ml-2 ${
            orientation === 'horizontal'
              ? 'flex gap-4 overflow-x-auto pb-4'
              : 'space-y-4'
          }`}
        >
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`relative group/step ${
                orientation === 'horizontal'
                  ? 'min-w-[250px] flex-shrink-0'
                  : 'flex gap-4'
              }`}
            >
              {orientation === 'vertical' && (
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-indigo-600 rounded-full mt-2"></div>
                  {index < steps.length - 1 && (
                    <div className="w-0.5 flex-1 bg-indigo-300 min-h-[40px]"></div>
                  )}
                </div>
              )}

              <div
                className={`flex-1 p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-300 bg-gray-50 ${
                  orientation === 'horizontal' ? 'relative' : ''
                }`}
              >
                {orientation === 'horizontal' && (
                  <div className="absolute -top-2 left-4 w-3 h-3 bg-indigo-600 rounded-full"></div>
                )}

                <div className="absolute top-2 right-2 opacity-0 group-hover/step:opacity-100 transition-opacity flex gap-1">
                  <button
                    onClick={() => moveStep(index, 'up')}
                    disabled={index === 0}
                    className="p-1 hover:bg-indigo-100 rounded text-indigo-600 disabled:opacity-30"
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveStep(index, 'down')}
                    disabled={index === steps.length - 1}
                    className="p-1 hover:bg-indigo-100 rounded text-indigo-600 disabled:opacity-30"
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

                {step.date && (
                  <div className="text-xs font-semibold text-indigo-600 mb-2">
                    {editingId === step.id && editField === 'date' ? (
                      <input
                        type="text"
                        value={step.date}
                        onChange={(e) => handleStepChange(step.id, 'date', e.target.value)}
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
                          setEditField('date');
                        }}
                        className="cursor-text"
                      >
                        {step.date}
                      </span>
                    )}
                  </div>
                )}

                <div className="font-semibold text-gray-900 mb-1">
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

                <div className="text-sm text-gray-600">
                  {editingId === step.id && editField === 'description' ? (
                    <textarea
                      value={step.description}
                      onChange={(e) =>
                        handleStepChange(step.id, 'description', e.target.value)
                      }
                      onBlur={() => {
                        setEditingId(null);
                        setEditField(null);
                      }}
                      autoFocus
                      className="w-full border border-gray-300 rounded px-2 py-1 resize-none"
                      rows={2}
                    />
                  ) : (
                    <span
                      onClick={() => {
                        setEditingId(step.id);
                        setEditField('description');
                      }}
                      className="cursor-text"
                    >
                      {step.description}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addStep}
          className="mt-3 flex items-center gap-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-2 rounded transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Add step</span>
        </button>
      </div>
    </NodeViewWrapper>
  );
};

export default TimelineView;
