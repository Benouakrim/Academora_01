import React, { useState } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { Calculator, Plus, Trash2, GripVertical } from 'lucide-react';
import type { CalculatorAttributes, CalculatorField } from '../types/BlockTypes';

interface CalculatorViewProps {
  node: {
    attrs: CalculatorAttributes;
  };
  updateAttributes: (attrs: Partial<CalculatorAttributes>) => void;
  deleteNode: () => void;
  selected: boolean;
}

const CalculatorView: React.FC<CalculatorViewProps> = ({
  node,
  updateAttributes,
  deleteNode,
  selected,
}) => {
  const { title, description, fields, formula, resultLabel, resultUnit } = node.attrs;
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);

  const initialValues: Record<string, number> = {};
  fields.forEach((field) => {
    initialValues[`field_${field.id}`] = Number(field.defaultValue) || 0;
  });
  const [previewValues, setPreviewValues] = useState<Record<string, number>>(initialValues);

  const calculateResult = () => {
    try {
      const evalFormula = formula.replace(/field_(\d+)/g, (_match: string, id: string) => {
        return String(previewValues[`field_${id}`] || 0);
      });
      // Use Function constructor instead of eval for safer formula evaluation
      const func = new Function('return ' + evalFormula);
      return func();
    } catch {
      return 'Error';
    }
  };

  const handleFieldChange = (id: string, updates: Partial<CalculatorField>) => {
    const updatedFields = fields.map((field) =>
      field.id === id ? { ...field, ...updates } : field
    );
    updateAttributes({ fields: updatedFields });
  };

  const addField = () => {
    const newField: CalculatorField = {
      id: Date.now().toString(),
      label: 'New Field',
      type: 'number',
      defaultValue: 0,
      min: 0,
      max: 100,
      step: 1,
    };
    updateAttributes({ fields: [...fields, newField] });
    setEditingFieldId(newField.id);
  };

  const removeField = (id: string) => {
    const updatedFields = fields.filter((field) => field.id !== id);
    updateAttributes({ fields: updatedFields });
  };

  return (
    <NodeViewWrapper
      className={`calculator-node-view ${selected ? 'selected' : ''}`}
      data-drag-handle
    >
      <div className="relative group border-2 border-gray-200 rounded-lg p-4 bg-white hover:border-emerald-300 transition-colors">
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

        <div className="flex items-center gap-2 mb-2 pt-6">
          <Calculator className="w-6 h-6 text-emerald-600" />
          <input
            type="text"
            value={title}
            onChange={(e) => updateAttributes({ title: e.target.value })}
            className="flex-1 text-xl font-bold border-b-2 border-transparent hover:border-gray-300 focus:border-emerald-500 focus:outline-none px-2 py-1"
            placeholder="Calculator title..."
          />
        </div>

        <textarea
          value={description}
          onChange={(e) => updateAttributes({ description: e.target.value })}
          className="w-full ml-8 mb-4 text-sm text-gray-600 border-b border-transparent hover:border-gray-300 focus:border-emerald-500 focus:outline-none px-2 py-1 resize-none"
          placeholder="Description..."
          rows={2}
        />

        <div className="space-y-3 ml-2">
          {fields.map((field) => (
            <div
              key={field.id}
              className="p-3 bg-gray-50 rounded-lg border border-gray-200 group/field"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  {editingFieldId === field.id ? (
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => handleFieldChange(field.id, { label: e.target.value })}
                      onBlur={() => setEditingFieldId(null)}
                      autoFocus
                      className="w-full border border-gray-300 rounded px-2 py-1 font-medium"
                    />
                  ) : (
                    <div
                      onClick={() => setEditingFieldId(field.id)}
                      className="cursor-text font-medium"
                    >
                      {field.label}
                    </div>
                  )}
                  <div className="text-xs text-gray-500 mt-1">
                    Reference: <code className="bg-gray-200 px-1 rounded">field_{field.id}</code>
                  </div>
                </div>
                <button
                  onClick={() => removeField(field.id)}
                  className="p-1 hover:bg-red-100 rounded text-red-600 opacity-0 group-hover/field:opacity-100 transition-opacity"
                  title="Remove field"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Type</label>
                  <select
                    value={field.type}
                    onChange={(e) =>
                      handleFieldChange(field.id, {
                        type: e.target.value as 'number' | 'select' | 'range',
                      })
                    }
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="number">Number</option>
                    <option value="range">Range</option>
                    <option value="select">Select</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Default Value</label>
                  <input
                    type="number"
                    value={Number(field.defaultValue)}
                    onChange={(e) =>
                      handleFieldChange(field.id, { defaultValue: Number(e.target.value) })
                    }
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                </div>
                {(field.type === 'number' || field.type === 'range') && (
                  <>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Min</label>
                      <input
                        type="number"
                        value={field.min || 0}
                        onChange={(e) =>
                          handleFieldChange(field.id, { min: Number(e.target.value) })
                        }
                        className="w-full border border-gray-300 rounded px-2 py-1"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Max</label>
                      <input
                        type="number"
                        value={field.max || 100}
                        onChange={(e) =>
                          handleFieldChange(field.id, { max: Number(e.target.value) })
                        }
                        className="w-full border border-gray-300 rounded px-2 py-1"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="mt-2">
                <label className="block text-xs text-gray-600 mb-1">Preview:</label>
                <input
                  type={field.type === 'range' ? 'range' : 'number'}
                  value={previewValues[`field_${field.id}`] || field.defaultValue}
                  onChange={(e) =>
                    setPreviewValues({
                      ...previewValues,
                      [`field_${field.id}`]: Number(e.target.value),
                    })
                  }
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  className="w-full border border-gray-300 rounded px-2 py-1"
                />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addField}
          className="mt-3 flex items-center gap-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-2 rounded transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Add field</span>
        </button>

        <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Formula (use field_1, field_2, etc.)
            </label>
            <input
              type="text"
              value={formula}
              onChange={(e) => updateAttributes({ formula: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="field_1 * field_2"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Result Label</label>
              <input
                type="text"
                value={resultLabel}
                onChange={(e) => updateAttributes({ resultLabel: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Result Unit</label>
              <input
                type="text"
                value={resultUnit}
                onChange={(e) => updateAttributes({ resultUnit: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                placeholder="$"
              />
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
            <strong className="text-emerald-800">Preview Result:</strong>
            <div className="text-2xl font-bold text-emerald-900 mt-1">
              {resultUnit}
              {calculateResult()}
            </div>
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export default CalculatorView;
