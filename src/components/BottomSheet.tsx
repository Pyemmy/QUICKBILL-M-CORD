import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex flex-col justify-end">
      <div
        className="fixed inset-0 bg-[#0B1220]/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative z-10 w-full bg-white rounded-t-[16px] border-t border-[#E4E7EC] shadow-[0_4px_18px_rgba(11,18,32,0.15)] p-5 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-200 ${className}`}
      >
        <div className="w-10 h-1 rounded-full bg-[#D0D5DD] mx-auto mb-4" />
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E4E7EC]">
          {title ? (
            <h3 className="text-base font-bold text-[#0B1220]">{title}</h3>
          ) : (
            <div />
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-[6px] text-[#98A2B3] hover:text-[#0B1220] hover:bg-[#F2F4F7]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
