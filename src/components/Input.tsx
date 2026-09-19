import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  warning?: string;
  hint?: string;
  isAiFilled?: boolean;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      warning,
      hint,
      isAiFilled = false,
      leftElement,
      rightElement,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <div className="flex items-center justify-between">
            <label
              htmlFor={inputId}
              className="text-xs font-semibold text-[#344054] tracking-normal"
            >
              {label}
            </label>
            {isAiFilled && (
              <span className="text-[11px] font-medium text-[#4C7DFF] bg-[#EEF2FF] px-2 py-0.5 rounded-[4px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4C7DFF]"></span>
                AI Filled
              </span>
            )}
          </div>
        )}
        <div className="relative flex items-center">
          {leftElement && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-[#667085]">
              {leftElement}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full h-[48px] rounded-[8px] border bg-white px-3.5 text-sm text-[#0B1220] placeholder-[#98A2B3] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-[#F2F4F7] disabled:text-[#98A2B3] disabled:cursor-not-allowed ${
              leftElement ? 'pl-10' : ''
            } ${rightElement ? 'pr-10' : ''} ${
              error
                ? 'border-[#DC3E3E] focus:border-[#DC3E3E] focus:ring-[#DC3E3E]/20'
                : warning
                ? 'border-[#F4B740] focus:border-[#F4B740] focus:ring-[#F4B740]/20'
                : 'border-[#E4E7EC] focus:border-[#0B1220] focus:ring-[#0B1220]/10'
            } ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3.5 flex items-center text-[#667085]">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-[#DC3E3E] font-medium flex items-center gap-1 mt-0.5">
            {error}
          </p>
        )}
        {!error && warning && (
          <p className="text-xs text-[#925F07] bg-[#FEF6E7] px-2.5 py-1 rounded-[4px] border border-[#F4B740]/40 font-medium flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F4B740] shrink-0"></span>
            {warning}
          </p>
        )}
        {!error && !warning && hint && (
          <p className="text-xs text-[#667085] mt-0.5">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
