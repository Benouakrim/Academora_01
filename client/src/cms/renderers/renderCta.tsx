import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { CtaAttributes } from '../types/BlockTypes';

interface RenderCtaProps {
  attrs: CtaAttributes;
}

const RenderCta: React.FC<RenderCtaProps> = ({ attrs }) => {
  const sizeClasses = {
    small: 'py-8 px-6',
    medium: 'py-12 px-8',
    large: 'py-16 px-10',
  };

  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  const buttonSizeClasses = {
    small: 'px-6 py-2 text-sm',
    medium: 'px-8 py-3 text-base',
    large: 'px-10 py-4 text-lg',
  };

  return (
    <div className="cta-renderer my-8 rounded-xl shadow-lg overflow-hidden">
      <div
        className={`flex flex-col ${sizeClasses[attrs.size]} ${alignmentClasses[attrs.alignment]}`}
        style={{
          backgroundColor: attrs.backgroundColor,
          color: attrs.textColor,
        }}
      >
        <h3
          className="text-3xl md:text-4xl font-bold mb-4"
          style={{ color: attrs.textColor }}
        >
          {attrs.title}
        </h3>

        {attrs.description && (
          <p
            className="text-lg md:text-xl mb-6 max-w-2xl opacity-90"
            style={{ color: attrs.textColor }}
          >
            {attrs.description}
          </p>
        )}

        <a
          href={attrs.buttonUrl}
          className={`inline-flex items-center gap-2 font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ${buttonSizeClasses[attrs.size]}`}
          style={{
            backgroundColor: attrs.textColor,
            color: attrs.backgroundColor,
          }}
        >
          {attrs.buttonText}
          <ArrowRight className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
};

export default RenderCta;
