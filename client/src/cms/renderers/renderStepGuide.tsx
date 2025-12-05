import React from 'react';
import { List, CheckCircle } from 'lucide-react';
import type { StepGuideAttributes } from '../types/BlockTypes';

interface RenderStepGuideProps {
  attrs: StepGuideAttributes;
}

const RenderStepGuide: React.FC<RenderStepGuideProps> = ({ attrs }) => {
  return (
    <div className="step-guide-renderer my-8 p-6 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-200 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <List className="w-7 h-7 text-teal-600" />
        <h3 className="text-2xl font-bold text-gray-900">{attrs.title}</h3>
      </div>

      <div className="space-y-6">
        {attrs.steps.map((step, index) => (
          <div
            key={step.id}
            className="relative p-5 bg-white rounded-lg border-2 border-teal-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              {attrs.showNumbers && (
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-teal-600 to-cyan-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                  {index + 1}
                </div>
              )}

              <div className="flex-1">
                <h4 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  {step.title}
                  {index === attrs.steps.length - 1 && (
                    <CheckCircle className="w-5 h-5 text-teal-600" />
                  )}
                </h4>
                <p className="text-gray-700 leading-relaxed">{step.content}</p>

                {step.imageUrl && (
                  <div className="mt-4">
                    <img
                      src={step.imageUrl}
                      alt={step.title}
                      className="w-full rounded-lg border-2 border-gray-200 shadow-sm max-h-64 object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Connector line */}
            {index < attrs.steps.length - 1 && (
              <div className="absolute left-[45px] bottom-[-24px] w-0.5 h-6 bg-teal-300" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-teal-100 border-2 border-teal-300 rounded-lg">
        <p className="text-sm text-teal-900 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <strong>
            {attrs.steps.length} {attrs.steps.length === 1 ? 'step' : 'steps'} to
            complete
          </strong>
        </p>
      </div>
    </div>
  );
};

export default RenderStepGuide;
