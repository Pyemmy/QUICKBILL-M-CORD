import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  isFintech?: boolean;
}

export interface SelectProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  isSearchable?: boolean;
  disabled?: boolean;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select option',
  error,
  isSearchable = false,
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && isSearchable && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
    if (!isOpen) {
      setSearchTerm('');
    }
  }, [isOpen, isSearchable]);

  const filteredOptions = isSearchable
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (opt.description && opt.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : options;

  return (
    <div className={`w-full flex flex-col gap-1.5 relative ${className}`} ref={containerRef}>
      {label && (
        <label className="text-xs font-semibold text-[#344054]">
          {label}
        </label>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-[48px] rounded-[8px] border bg-white px-3.5 text-left text-sm flex items-center justify-between transition-colors focus:outline-none focus:ring-2 disabled:bg-[#F2F4F7] disabled:cursor-not-allowed ${
          error
            ? 'border-[#DC3E3E] focus:border-[#DC3E3E] focus:ring-[#DC3E3E]/20'
            : isOpen
            ? 'border-[#0B1220] ring-2 ring-[#0B1220]/10'
            : 'border-[#E4E7EC] hover:border-[#D0D5DD]'
        }`}
      >
        <span className={selectedOption ? 'text-[#0B1220] font-medium' : 'text-[#98A2B3]'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[#667085] transition-transform duration-150 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-[100%] left-0 right-0 mt-1 z-50 bg-white border border-[#E4E7EC] rounded-[8px] shadow-[0_4px_18px_rgba(11,18,32,0.08)] max-h-[260px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          {isSearchable && (
            <div className="p-2 border-b border-[#E4E7EC] bg-[#F9FAFB]">
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 absolute left-2.5 text-[#667085]" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="w-full h-[36px] pl-8 pr-3 text-xs bg-white border border-[#E4E7EC] rounded-[6px] focus:outline-none focus:border-[#0B1220]"
                />
              </div>
            </div>
          )}
          <div className="overflow-y-auto py-1 flex-1">
            {filteredOptions.length === 0 ? (
              <div className="px-3.5 py-3 text-xs text-[#667085] text-center">
                No matching options
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full px-3.5 py-2.5 text-left text-sm flex items-center justify-between hover:bg-[#F2F4F7] transition-colors ${
                      isSelected ? 'bg-[#EEF2FF] text-[#0B1220] font-medium' : 'text-[#344054]'
                    }`}
                  >
                    <div>
                      <div>{opt.label}</div>
                      {opt.description && (
                        <div className="text-xs text-[#667085]">{opt.description}</div>
                      )}
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#4C7DFF] shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {error && <p className="text-xs text-[#DC3E3E] font-medium">{error}</p>}
    </div>
  );
};
