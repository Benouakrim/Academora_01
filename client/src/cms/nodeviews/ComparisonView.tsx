import React, { useState } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { Table, Plus, Trash2, GripVertical } from 'lucide-react';
import type { ComparisonAttributes, ComparisonColumn } from '../types/BlockTypes';

interface ComparisonViewProps {
  node: {
    attrs: ComparisonAttributes;
  };
  updateAttributes: (attrs: Partial<ComparisonAttributes>) => void;
  deleteNode: () => void;
  selected: boolean;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({
  node,
  updateAttributes,
  deleteNode,
  selected,
}) => {
  const { title, columns } = node.attrs;
  const [editingCell, setEditingCell] = useState<{
    colId: string;
    cellIndex: number;
  } | null>(null);
  const [editingHeader, setEditingHeader] = useState<string | null>(null);

  const maxRows = Math.max(...columns.map((col) => col.cells.length), 1);

  const handleTitleChange = (newTitle: string) => {
    updateAttributes({ title: newTitle });
  };

  const handleHeaderChange = (colId: string, newHeader: string) => {
    const updatedColumns = columns.map((col) =>
      col.id === colId ? { ...col, header: newHeader } : col
    );
    updateAttributes({ columns: updatedColumns });
  };

  const handleCellChange = (colId: string, cellIndex: number, newValue: string) => {
    const updatedColumns = columns.map((col) => {
      if (col.id === colId) {
        const newCells = [...col.cells];
        newCells[cellIndex] = newValue;
        return { ...col, cells: newCells };
      }
      return col;
    });
    updateAttributes({ columns: updatedColumns });
  };

  const addColumn = () => {
    const newColumn: ComparisonColumn = {
      id: Date.now().toString(),
      header: 'New Column',
      cells: Array(maxRows).fill(''),
    };
    updateAttributes({ columns: [...columns, newColumn] });
  };

  const removeColumn = (colId: string) => {
    if (columns.length <= 2) {
      alert('Comparison table must have at least 2 columns');
      return;
    }
    const updatedColumns = columns.filter((col) => col.id !== colId);
    updateAttributes({ columns: updatedColumns });
  };

  const addRow = () => {
    const updatedColumns = columns.map((col) => ({
      ...col,
      cells: [...col.cells, ''],
    }));
    updateAttributes({ columns: updatedColumns });
  };

  const removeRow = (rowIndex: number) => {
    if (maxRows <= 1) {
      alert('Comparison table must have at least 1 row');
      return;
    }
    const updatedColumns = columns.map((col) => ({
      ...col,
      cells: col.cells.filter((_, index) => index !== rowIndex),
    }));
    updateAttributes({ columns: updatedColumns });
  };

  return (
    <NodeViewWrapper
      className={`comparison-node-view ${selected ? 'selected' : ''}`}
      data-drag-handle
    >
      <div className="relative group border-2 border-gray-200 rounded-lg p-4 bg-white hover:border-orange-300 transition-colors">
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
          <Table className="w-6 h-6 text-orange-600" />
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="flex-1 text-xl font-bold border-b-2 border-transparent hover:border-gray-300 focus:border-orange-500 focus:outline-none px-2 py-1"
            placeholder="Comparison title..."
          />
        </div>

        <div className="overflow-x-auto ml-2">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.id}
                    className="relative group/header border-2 border-gray-300 bg-orange-50 p-2"
                  >
                    {editingHeader === col.id ? (
                      <input
                        type="text"
                        value={col.header}
                        onChange={(e) => handleHeaderChange(col.id, e.target.value)}
                        onBlur={() => setEditingHeader(null)}
                        autoFocus
                        className="w-full border border-gray-300 rounded px-2 py-1 font-semibold"
                      />
                    ) : (
                      <div
                        onClick={() => setEditingHeader(col.id)}
                        className="cursor-text font-semibold"
                      >
                        {col.header}
                      </div>
                    )}
                    <button
                      onClick={() => removeColumn(col.id)}
                      className="absolute -top-2 -right-2 p-1 bg-red-100 hover:bg-red-200 rounded-full text-red-600 opacity-0 group-hover/header:opacity-100 transition-opacity"
                      title="Remove column"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: maxRows }).map((_, rowIndex) => (
                <tr key={rowIndex} className="group/row">
                  {columns.map((col) => (
                    <td
                      key={col.id}
                      className="border-2 border-gray-300 p-2 relative group/cell"
                    >
                      {editingCell?.colId === col.id &&
                      editingCell?.cellIndex === rowIndex ? (
                        <input
                          type="text"
                          value={col.cells[rowIndex] || ''}
                          onChange={(e) =>
                            handleCellChange(col.id, rowIndex, e.target.value)
                          }
                          onBlur={() => setEditingCell(null)}
                          autoFocus
                          className="w-full border border-gray-300 rounded px-2 py-1"
                        />
                      ) : (
                        <div
                          onClick={() => setEditingCell({ colId: col.id, cellIndex: rowIndex })}
                          className="cursor-text min-h-[24px]"
                        >
                          {col.cells[rowIndex] || ''}
                        </div>
                      )}
                    </td>
                  ))}
                  <td className="pl-2">
                    <button
                      onClick={() => removeRow(rowIndex)}
                      className="p-1 hover:bg-red-100 rounded text-red-600 opacity-0 group-hover/row:opacity-100 transition-opacity"
                      title="Remove row"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-2 mt-3">
          <button
            onClick={addColumn}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 px-3 py-2 rounded transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Add column</span>
          </button>
          <button
            onClick={addRow}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 px-3 py-2 rounded transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Add row</span>
          </button>
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export default ComparisonView;
