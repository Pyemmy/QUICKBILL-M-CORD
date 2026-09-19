import React, { useState } from 'react';
import { Check, Clock, AlertCircle, Info, ShieldCheck } from 'lucide-react';
import { VerificationStatus, CacType } from '../types';
import { formatDate } from '../lib/formatters';

export interface TrustBadgeProps {
  status: VerificationStatus;
  registrationNumber?: string;
  cacType?: CacType;
  reviewedAt?: string;
  className?: string;
  showPopover?: boolean;
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({
  status,
  registrationNumber,
  cacType = 'LIMITED_COMPANY',
  reviewedAt,
  className = '',
  showPopover = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const prefix = cacType === 'BUSINESS_NAME' ? 'BN' : 'RC';

  if (status === 'VERIFIED') {
    return (
      <div className={`relative inline-block ${className}`} id="cac-verified-badge">
        <button
          type="button"
          onClick={() => showPopover && setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-[#E8F8EE] border border-[#16A34A]/30 text-[#16A34A] text-xs font-bold tracking-tight transition-colors hover:bg-[#DCF5E5] cursor-pointer"
          title="Verified by CAC Registry"
        >
          <Check className="w-3.5 h-3.5 stroke-[3]" />
          <span>CAC VERIFIED MERCHANT</span>
          {registrationNumber && (
            <span className="text-[#0B1220] font-semibold ml-1">
              {prefix} {registrationNumber}
            </span>
          )}
          {showPopover && <Info className="w-3 h-3 text-[#16A34A]/70 ml-0.5" />}
        </button>

        {isOpen && showPopover && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute left-0 top-full mt-1.5 z-50 w-72 rounded-[10px] bg-[#0B1220] text-white p-3.5 text-xs shadow-xl border border-white/10 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 mb-2 text-[#27D6A3] font-semibold">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Verified Entity Credentials</span>
              </div>
              <p className="text-white/80 leading-relaxed text-[11px] mb-2">
                This merchant's Corporate Affairs Commission certificate has been independently authenticated by QUICKBILL Trust Operations.
              </p>
              <div className="pt-2 border-t border-white/10 flex flex-col gap-1 text-[11px] text-white/60">
                <div>
                  <span className="text-white/40">Registration:</span> {prefix} {registrationNumber || 'N/A'}
                </div>
                <div>
                  <span className="text-white/40">Registry:</span> Corporate Affairs Commission (Nigeria)
                </div>
                {reviewedAt && (
                  <div>
                    <span className="text-white/40">Verified date:</span> {formatDate(reviewedAt)}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  if (status === 'PENDING') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[6px] bg-[#FEF6E7] border border-[#F4B740]/40 text-[#B54708] text-xs font-semibold ${className}`}>
        <Clock className="w-3.5 h-3.5 shrink-0" />
        <span>Unverified Merchant · Pending Review</span>
      </div>
    );
  }

  // REJECTED or unverified
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[6px] bg-[#F2F4F7] border border-[#E4E7EC] text-[#667085] text-xs font-medium ${className}`}>
      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-[#98A2B3]" />
      <span>Unverified Merchant</span>
    </div>
  );
};
