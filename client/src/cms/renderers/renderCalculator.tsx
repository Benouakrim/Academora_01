import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import type { CalculatorAttributes } from '../types/BlockTypes';

interface RenderCalculatorProps {
  attrs: CalculatorAttributes;
}

const RenderCalculator: React.FC<RenderCalculatorProps> = ({ attrs }) => {
  const initialValues: Record<string, number> = {};
  attrs.fields.forEach((field) => {
    initialValues[`field_${field.id}`] = Number(field.defaultValue) || 0;
  });
  
  const [values, setValues] = useState<Record<string, number>>(initialValues);

  const calculateResult = () => {
    try {
      const evalFormula = attrs.formula.replace(/field_(\d+)/g, (_match: string, id: string) => {
        return String(values[`field_${id}`] || 0);
      });
      const func = new Function('return ' + evalFormula);
      const result = func();
      return typeof result === 'number' ? result.toLocaleString() : result;
    } catch {
      return 'Error';
    }
  };

  const handleValueChange = (fieldId: string, value: number) => {
    setValues((prev) => ({
      ...prev,
      [`field_${fieldId}`]: value,
    }));
  };

  return (
    <div className="calculator-renderer my-8 p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <Calculator className="w-7 h-7 text-emerald-600" />
        <h3 className="text-2xl font-bold text-gray-900">{attrs.title}</h3>
      </div>

      {attrs.description && (
        <p className="text-gray-600 mb-6">{attrs.description}</p>
      )}

      <div className="space-y-4 mb-6">
        {attrs.fields.map((field) => (
          <div key={field.id} className="bg-white p-4 rounded-lg border-2 border-emerald-200">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {field.label}
            </label>

            {field.type === 'number' && (
              <input
                type="number"
                value={values[`field_${field.id}`]}
                onChange={(e) => handleValueChange(field.id, Number(e.target.value))}
                min={field.min}
                max={field.max}
                step={field.step}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            )}

            {field.type === 'range' && (
              <div>
                <input
                  type="range"
                  value={values[`field_${field.id}`]}
                  onChange={(e) => handleValueChange(field.id, Number(e.target.value))}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>{field.min}</span>
                  <span className="font-bold text-emerald-700">
                    {values[`field_${field.id}`]}
                  </span>
                  <span>{field.max}</span>
                </div>
              </div>
            )}

            {field.type === 'select' && field.options && (
              <select
                value={values[`field_${field.id}`]}
                onChange={(e) => handleValueChange(field.id, Number(e.target.value))}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {field.options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>

      <div className="p-6 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg shadow-lg">
        <div className="text-sm font-medium mb-1 opacity-90">{attrs.resultLabel}</div>
        <div className="text-4xl font-bold">
          {attrs.resultUnit}
          {calculateResult()}
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-600 text-center">
        <p>Adjust the values above to recalculate</p>
      </div>
    </div>
  );
};

export default RenderCalculator;
