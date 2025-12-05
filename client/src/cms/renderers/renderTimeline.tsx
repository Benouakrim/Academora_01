import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import type { TimelineAttributes } from '../types/BlockTypes';

interface RenderTimelineProps {
  attrs: TimelineAttributes;
}

const RenderTimeline: React.FC<RenderTimelineProps> = ({ attrs }) => {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());

  const toggleStep = (stepId: string) => {
    setExpandedSteps((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(stepId)) {
        newSet.delete(stepId);
      } else {
        newSet.add(stepId);
      }
      return newSet;
    });
  };

  if (attrs.orientation === 'horizontal') {
    return (
      <div className="timeline-renderer my-8 p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-7 h-7 text-indigo-600" />
          <h3 className="text-2xl font-bold text-gray-900">{attrs.title}</h3>
        </div>

        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max relative">
            {/* Horizontal line */}
            <div className="absolute top-[20px] left-[40px] right-[40px] h-1 bg-indigo-300" />

            {attrs.steps.map((step) => (
              <div
                key={step.id}
                className="relative min-w-[250px] flex-shrink-0"
              >
                {/* Dot */}
                <div className="absolute top-[12px] left-[32px] w-5 h-5 bg-indigo-600 rounded-full border-4 border-white z-10 shadow-md" />

                {/* Card */}
                <div className="mt-12 p-4 bg-white rounded-lg border-2 border-indigo-200 shadow-sm hover:shadow-md transition-shadow">
                  {step.date && (
                    <div className="text-sm font-bold text-indigo-600 mb-2">
                      {step.date}
                    </div>
                  )}
                  <h4 className="font-bold text-gray-900 mb-2">{step.title}</h4>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Vertical orientation
  return (
    <div className="timeline-renderer my-8 p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-200 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-7 h-7 text-indigo-600" />
        <h3 className="text-2xl font-bold text-gray-900">{attrs.title}</h3>
      </div>

      <div className="relative">
        {attrs.steps.map((step, index) => {
          const isExpanded = expandedSteps.has(step.id);
          const isLast = index === attrs.steps.length - 1;

          return (
            <div key={step.id} className="flex gap-4 relative">
              {/* Timeline line and dot */}
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-indigo-600 rounded-full mt-2 border-4 border-white shadow-md z-10" />
                {!isLast && (
                  <div className="w-0.5 flex-1 bg-indigo-300 min-h-[60px]" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-8">
                <button
                  onClick={() => toggleStep(step.id)}
                  className="w-full text-left p-4 bg-white rounded-lg border-2 border-indigo-200 hover:border-indigo-400 transition-all shadow-sm hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {step.date && (
                        <div className="text-sm font-bold text-indigo-600 mb-1">
                          {step.date}
                        </div>
                      )}
                      <h4 className="font-bold text-gray-900 mb-2">{step.title}</h4>
                      <p
                        className={`text-sm text-gray-600 transition-all ${
                          isExpanded ? '' : 'line-clamp-2'
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                    {step.description.length > 100 && (
                      <div className="ml-2">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-indigo-600" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-indigo-600" />
                        )}
                      </div>
                    )}
                  </div>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RenderTimeline;
