import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, ArrowRight, X, Loader2 } from 'lucide-react';
import { Button } from './Button';

export interface PromptBoxProps {
  onSubmit: (prompt: string) => void;
  isGenerating?: boolean;
  generatingPhase?: 'reading' | 'structuring' | 'branding';
  onCancel?: () => void;
  initialValue?: string;
  error?: string;
  className?: string;
}

const EXAMPLE_PROMPTS = [
  {
    label: 'Bill Chief Okafor 45k for 3 bags of rice + 5k deli...',
    full: 'Bill Chief Okafor 45k Naira for 3 bags of rice delivered today, plus 5k delivery fee. Due in 2 days.',
  },
  {
    label: 'Invoice Tunde for 3 hrs wedding photography at 25k...',
    full: 'Invoice Tunde for 3 hrs wedding photography at 25k per hour plus 10k photo album. Due next Friday.',
  },
  {
    label: 'Charge Mama Nkechi for 20 crates of eggs at ₦4,500...',
    full: 'Charge Mama Nkechi for 20 crates of eggs at ₦4,500 each and ₦8,000 logistics. Due tomorrow.',
  },
  {
    label: 'Bill Amaka Beauty Hub 120k for logo and brand kit ...',
    full: 'Bill Amaka Beauty Hub 120,000 Naira for logo and brand kit design, 50% deposit paid, remaining 60k due in 7 days.',
  },
];

export const PromptBox: React.FC<PromptBoxProps> = ({
  onSubmit,
  isGenerating = false,
  generatingPhase = 'reading',
  onCancel,
  initialValue = '',
  error,
  className = '',
}) => {
  const [prompt, setPrompt] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (initialValue) {
      setPrompt(initialValue);
    }
  }, [initialValue]);

  useEffect(() => {
    if (!isGenerating) {
      textareaRef.current?.focus();
    }
  }, [isGenerating]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (prompt.trim() && !isGenerating) {
        onSubmit(prompt.trim());
      }
    }
  };

  const handleSelectExample = (text: string) => {
    setPrompt(text);
    textareaRef.current?.focus();
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (prompt.trim() && !isGenerating) {
      onSubmit(prompt.trim());
    }
  };

  return (
    <div
      className={`rounded-[12px] border border-[#E4E7EC] bg-white p-5 shadow-[0_4px_18px_rgba(11,18,32,0.04)] transition-all ${
        isGenerating ? 'border-[#4C7DFF]' : 'focus-within:border-[#0B1220]'
      } ${className}`}
    >
      {/* Header Tag */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#4C7DFF] tracking-wider uppercase">
          <span className="w-2 h-2 rounded-full bg-[#4C7DFF] animate-pulse" />
          <span>AI COMPOSER</span>
        </div>

        {isGenerating && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1 text-xs text-[#667085] hover:text-[#DC3E3E] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>
        )}
      </div>

      {isGenerating ? (
        <div className="py-6 flex flex-col items-center justify-center gap-4 text-center">
          <div className="relative flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-2 border-[#4C7DFF]/20 border-t-[#4C7DFF] animate-spin" />
            <Sparkles className="w-5 h-5 text-[#4C7DFF] absolute" />
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[#0B1220]">
              {generatingPhase === 'reading' && 'Reading your invoice request...'}
              {generatingPhase === 'structuring' && 'Extracting items, rates, and due dates...'}
              {generatingPhase === 'branding' && 'Applying your brand & calculating totals...'}
            </h4>
            <p className="text-xs text-[#667085]">
              Powered by AI Studio financial model (Africa/Lagos)
            </p>
          </div>

          {/* Three-step phase progress pills */}
          <div className="flex items-center gap-2 mt-2">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                generatingPhase === 'reading' ||
                generatingPhase === 'structuring' ||
                generatingPhase === 'branding'
                  ? 'w-8 bg-[#4C7DFF]'
                  : 'w-4 bg-[#E4E7EC]'
              }`}
            />
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                generatingPhase === 'structuring' || generatingPhase === 'branding'
                  ? 'w-8 bg-[#4C7DFF]'
                  : 'w-4 bg-[#E4E7EC]'
              }`}
            />
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                generatingPhase === 'branding' ? 'w-8 bg-[#4C7DFF]' : 'w-4 bg-[#E4E7EC]'
              }`}
            />
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <textarea
            ref={textareaRef}
            rows={3}
            maxLength={500}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Bill Chief Okafor 45k Naira for 3 bags of rice delivered today, plus 5k delivery fee. Due in 2 days."
            className="w-full text-base text-[#0B1220] placeholder-[#98A2B3] resize-none border-none outline-none leading-relaxed bg-transparent"
          />

          {/* Example prompt pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {EXAMPLE_PROMPTS.map((ex, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectExample(ex.full)}
                className="px-2.5 py-1 text-xs rounded-full border border-[#E4E7EC] bg-[#FAFAFA] text-[#344054] hover:bg-[#F2F4F7] hover:border-[#D0D5DD] transition-all text-left truncate max-w-full sm:max-w-[280px]"
                title={ex.full}
              >
                {ex.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="text-xs text-[#DC3E3E] bg-[#FEF3F2] p-2.5 rounded-[6px] border border-[#DC3E3E]/20 mt-1">
              {error}
            </div>
          )}

          {/* Footer actions */}
          <div className="flex items-center justify-between pt-2 border-t border-[#F2F4F7]">
            <span className="text-xs text-[#98A2B3] hidden sm:inline">
              Ctrl+Enter to create · {prompt.length}/500 chars
            </span>
            <span className="text-xs text-[#98A2B3] sm:hidden">
              {prompt.length}/500
            </span>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!prompt.trim() || isGenerating}
              rightIcon={<ArrowRight className="w-4 h-4 text-[#0B1220]" />}
            >
              Create invoice
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
