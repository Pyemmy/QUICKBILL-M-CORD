import React from 'react';
import {
  FileText,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
} from 'lucide-react';
import { InvoiceStatus, VerificationStatus } from '../types';

export interface StatusChipProps {
  status: InvoiceStatus | VerificationStatus;
  daysOverdue?: number;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusChip: React.FC<StatusChipProps> = ({
  status,
  daysOverdue,
  size = 'md',
  className = '',
}) => {
  const isSm = size === 'sm';

  switch (status) {
    case 'PAID':
    case 'VERIFIED':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-semibold rounded-[6px] bg-[#E8F8EE] text-[#16A34A] border border-[#16A34A]/20 ${
            isSm ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
          } ${className}`}
        >
          <CheckCircle2 className={`${isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} shrink-0`} />
          <span>{status === 'VERIFIED' ? 'VERIFIED' : 'PAID'}</span>
        </span>
      );

    case 'PENDING':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-semibold rounded-[6px] bg-[#FEF6E7] text-[#B54708] border border-[#F4B740]/40 ${
            isSm ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
          } ${className}`}
        >
          <Clock className={`${isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} shrink-0`} />
          <span>PENDING REVIEW</span>
        </span>
      );

    case 'OVERDUE':
    case 'REJECTED':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-semibold rounded-[6px] bg-[#FEF3F2] text-[#DC3E3E] border border-[#DC3E3E]/20 ${
            isSm ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
          } ${className}`}
        >
          {status === 'OVERDUE' ? (
            <AlertCircle className={`${isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} shrink-0`} />
          ) : (
            <XCircle className={`${isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} shrink-0`} />
          )}
          <span>
            {status === 'OVERDUE'
              ? daysOverdue && daysOverdue > 0
                ? `OVERDUE (${daysOverdue}d)`
                : 'OVERDUE'
              : 'REJECTED'}
          </span>
        </span>
      );

    case 'SENT':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-[6px] bg-[#F2F4F7] text-[#344054] border border-[#E4E7EC] ${
            isSm ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
          } ${className}`}
        >
          <Send className={`${isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-[#667085] shrink-0`} />
          <span>SENT</span>
        </span>
      );

    case 'DRAFT':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-[6px] bg-[#F9FAFB] text-[#475467] border border-[#EAECF0] ${
            isSm ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
          } ${className}`}
        >
          <FileText className={`${isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-[#98A2B3] shrink-0`} />
          <span>DRAFT</span>
        </span>
      );
  }
};
