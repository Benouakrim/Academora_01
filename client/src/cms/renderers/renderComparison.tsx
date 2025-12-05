import React from 'react';
import { Table, Check, X } from 'lucide-react';
import type { ComparisonAttributes } from '../types/BlockTypes';

interface RenderComparisonProps {
  attrs: ComparisonAttributes;
}

const RenderComparison: React.FC<RenderComparisonProps> = ({ attrs }) => {
  const maxRows = Math.max(...attrs.columns.map((col) => col.cells.length), 0);

  // Helper function to render cell content with icons for checkmarks and X's
  const renderCellContent = (content: string) => {
    const lower = content.toLowerCase().trim();
    
    if (lower === '✓' || lower === 'yes' || lower === 'true' || lower === '✔') {
      return <Check className="w-5 h-5 text-green-600 mx-auto" />;
    }
    
    if (lower === '✗' || lower === 'no' || lower === 'false' || lower === '×') {
      return <X className="w-5 h-5 text-red-600 mx-auto" />;
    }
    
    return content;
  };

  return (
    <div className="comparison-renderer my-8 p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Table className="w-7 h-7 text-orange-600" />
        <h3 className="text-2xl font-bold text-gray-900">{attrs.title}</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-md">
          <thead>
            <tr className="bg-gradient-to-r from-orange-100 to-red-100">
              {attrs.columns.map((col, index) => (
                <th
                  key={col.id}
                  className={`p-4 text-left font-bold border-2 border-orange-200 ${
                    index === 0
                      ? 'text-gray-900 bg-orange-200'
                      : 'text-orange-900'
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: maxRows }).map((_, rowIndex) => (
              <tr
                key={rowIndex}
                className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-orange-50'}
              >
                {attrs.columns.map((col, colIndex) => (
                  <td
                    key={col.id}
                    className={`p-4 border-2 border-orange-200 ${
                      colIndex === 0
                        ? 'font-semibold text-gray-900 bg-orange-50'
                        : 'text-gray-700'
                    }`}
                  >
                    {renderCellContent(col.cells[rowIndex] || '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-xs text-gray-600 text-center">
        <p>Compare features side-by-side</p>
      </div>
    </div>
  );
};

export default RenderComparison;
