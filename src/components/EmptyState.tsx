import React from 'react';
import { FileQuestion } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center rounded-[12px] border border-dashed border-[#E4E7EC] bg-white ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-[#F2F4F7] text-[#667085] flex items-center justify-center mb-3">
        {icon || <FileQuestion className="w-6 h-6" />}
      </div>
      <h3 className="text-base font-bold text-[#0B1220] tracking-tight">{title}</h3>
      <p className="text-xs text-[#667085] max-w-sm mt-1 mb-4 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
