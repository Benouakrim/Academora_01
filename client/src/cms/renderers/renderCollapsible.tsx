import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { CollapsibleAttributes } from '../types/BlockTypes';

interface RenderCollapsibleProps {
  attrs: CollapsibleAttributes;
}

const RenderCollapsible: React.FC<RenderCollapsibleProps> = ({ attrs }) => {
  const [isOpen, setIsOpen] = useState(attrs.defaultOpen);

  return (
    <div className="collapsible-renderer my-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-lg hover:border-amber-300 hover:shadow-md transition-all group"
      >
        <h4 className="text-lg font-bold text-gray-900 group-hover:text-amber-700 transition-colors">
          {attrs.title}
        </h4>
        <ChevronDown
          className={`w-6 h-6 text-amber-600 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 bg-white border-2 border-t-0 border-amber-200 rounded-b-lg">
          <div className="prose prose-sm max-w-none text-gray-700">
            {attrs.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-2 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenderCollapsible;
