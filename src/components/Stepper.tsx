import React from 'react';
import { Check } from 'lucide-react';

export interface StepItem {
  id: number;
  label: string;
}

export interface StepperProps {
  steps: StepItem[];
  currentStep: number;
  onStepClick?: (stepId: number) => void;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepClick,
  className = '',
}) => {
  return (
    <nav aria-label="Progress" className={`flex items-center gap-1 sm:gap-3 ${className}`}>
      {steps.map((step, idx) => {
        const isCompleted = step.id < currentStep;
        const isCurrent = step.id === currentStep;
        const isClickable = onStepClick && step.id <= currentStep;

        return (
          <React.Fragment key={step.id}>
            <button
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && onStepClick?.(step.id)}
              className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium transition-colors select-none ${
                !isClickable ? 'cursor-default' : 'cursor-pointer hover:opacity-80'
              }`}
            >
              {isCompleted ? (
                <span className="w-5 h-5 rounded-full bg-[#16A34A]/15 text-[#16A34A] flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </span>
              ) : isCurrent ? (
                <span className="w-5 h-5 rounded-full border-2 border-[#0B1220] text-[#0B1220] flex items-center justify-center text-[11px] font-bold shrink-0">
                  {step.id}
                </span>
              ) : (
                <span className="w-5 h-5 rounded-full border border-[#D0D5DD] text-[#98A2B3] flex items-center justify-center text-[11px] font-medium shrink-0">
                  {step.id}
                </span>
              )}

              <span
                className={`hidden sm:inline ${
                  isCompleted
                    ? 'text-[#16A34A] font-semibold'
                    : isCurrent
                    ? 'text-[#0B1220] font-bold'
                    : 'text-[#98A2B3]'
                }`}
              >
                {step.label}
              </span>
            </button>

            {idx < steps.length - 1 && (
              <div className="w-4 sm:w-8 h-[1px] bg-[#E4E7EC] shrink-0" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
