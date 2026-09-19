import React from 'react';

export interface RadioCardOption {
  id: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export interface RadioCardProps {
  name: string;
  options: RadioCardOption[];
  selectedValue: string;
  onChange: (id: string) => void;
  className?: string;
}

export const RadioCard: React.FC<RadioCardProps> = ({
  options,
  selectedValue,
  onChange,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      {options.map((option) => {
        const isSelected = option.id === selectedValue;
        return (
          <label
            key={option.id}
            onClick={() => onChange(option.id)}
            className={`relative flex items-center gap-3.5 p-4 rounded-[10px] border cursor-pointer select-none transition-all duration-150 ${
              isSelected
                ? 'border-[#0B1220] bg-white ring-1 ring-[#0B1220]'
                : 'border-[#E4E7EC] bg-white hover:border-[#D0D5DD] hover:bg-[#FAFAFA]'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                isSelected
                  ? 'border-[#0B1220] bg-white'
                  : 'border-[#D0D5DD] bg-white'
              }`}
            >
              {isSelected && (
                <div className="w-2 h-2 rounded-full bg-[#0B1220]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-[#0B1220]">
                {option.title}
              </div>
              {option.subtitle && (
                <div className="text-xs text-[#667085] mt-0.5">
                  {option.subtitle}
                </div>
              )}
            </div>
            {option.icon && (
              <div className="shrink-0 text-[#667085]">{option.icon}</div>
            )}
          </label>
        );
      })}
    </div>
  );
};
