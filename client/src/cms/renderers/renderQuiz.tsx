import React, { useState } from 'react';
import { HelpCircle, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import type { QuizAttributes } from '../types/BlockTypes';

interface RenderQuizProps {
  attrs: QuizAttributes;
  blockId: string;
}

const RenderQuiz: React.FC<RenderQuizProps> = ({ attrs, blockId }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = () => {
    if (selectedOption) {
      setShowResult(true);
    }
  };

  const handleReset = () => {
    setSelectedOption(null);
    setShowResult(false);
  };

  const isCorrect = selectedOption
    ? attrs.options.find((opt) => opt.id === selectedOption)?.isCorrect
    : false;

  const correctOption = attrs.options.find((opt) => opt.isCorrect);

  return (
    <div className="quiz-renderer my-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 shadow-sm">
      <div className="flex items-start gap-3 mb-6">
        <HelpCircle className="w-7 h-7 text-purple-600 mt-1 flex-shrink-0" />
        <h3 className="text-xl font-bold text-gray-900">{attrs.question}</h3>
      </div>

      <div className="space-y-3 mb-6">
        {attrs.options.map((option) => {
          const isSelected = selectedOption === option.id;
          const isThisCorrect = option.isCorrect;
          
          let borderColor = 'border-gray-300';
          let bgColor = 'bg-white';
          
          if (showResult && isSelected) {
            if (isCorrect) {
              borderColor = 'border-green-500';
              bgColor = 'bg-green-50';
            } else {
              borderColor = 'border-red-500';
              bgColor = 'bg-red-50';
            }
          } else if (showResult && isThisCorrect) {
            borderColor = 'border-green-400';
            bgColor = 'bg-green-50';
          } else if (isSelected) {
            borderColor = 'border-purple-400';
            bgColor = 'bg-purple-50';
          }

          return (
            <label
              key={option.id}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${borderColor} ${bgColor} ${
                showResult ? '' : 'hover:border-purple-300 hover:shadow-sm'
              }`}
            >
              <input
                type="radio"
                name={`quiz-${blockId}`}
                value={option.id}
                checked={isSelected}
                onChange={() => {
                  if (!showResult) {
                    setSelectedOption(option.id);
                  }
                }}
                disabled={showResult}
                className="w-5 h-5 text-purple-600"
              />
              <span className="flex-1 text-gray-800">{option.text}</span>
              {showResult && isThisCorrect && (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
              {showResult && isSelected && !isCorrect && (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
            </label>
          );
        })}
      </div>

      {!showResult ? (
        <button
          onClick={handleSubmit}
          disabled={!selectedOption}
          className="w-full py-3 px-6 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Submit Answer
        </button>
      ) : (
        <>
          <div
            className={`p-4 rounded-lg mb-4 ${
              isCorrect
                ? 'bg-green-100 border-2 border-green-300'
                : 'bg-red-100 border-2 border-red-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? (
                <>
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="font-bold text-green-900">Correct!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-red-600" />
                  <span className="font-bold text-red-900">Incorrect</span>
                </>
              )}
            </div>
            {!isCorrect && correctOption && (
              <p className="text-sm text-gray-700">
                The correct answer is: <strong>{correctOption.text}</strong>
              </p>
            )}
          </div>

          {attrs.showExplanation && attrs.explanation && (
            <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg mb-4">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-blue-900 mb-1">Explanation</p>
                  <p className="text-sm text-gray-700">{attrs.explanation}</p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleReset}
            className="w-full py-3 px-6 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
          >
            Try Again
          </button>
        </>
      )}
    </div>
  );
};

export default RenderQuiz;
