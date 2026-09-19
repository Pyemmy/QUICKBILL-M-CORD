import React from 'react';
import { Copy, Check, Building2 } from 'lucide-react';
import { TemplateLayout, LineItem, VerificationStatus, CacType } from '../types';
import { formatDate, formatMoney } from '../lib/formatters';
import { TrustBadge } from './TrustBadge';

export interface InvoiceTemplateProps {
  template?: TemplateLayout;
  businessName: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: 'Inter' | 'Roboto' | 'Montserrat';
  verificationStatus?: VerificationStatus;
  cacType?: CacType;
  registrationNumber?: string;
  reviewedAt?: string;
  businessEmail?: string;
  businessPhone?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  clientName: string;
  clientEmail?: string | null;
  clientPhone?: string | null;
  lineItems: LineItem[];
  subtotal: number;
  taxRate?: number | null;
  taxAmount: number;
  totalAmount: number;
  isPaid?: boolean;
  isOverdue?: boolean;
  daysOverdue?: number;
  isCompactPreview?: boolean;
  className?: string;
}

export const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({
  template = 'modern',
  businessName,
  logoUrl,
  primaryColor = '#1E3A8A',
  secondaryColor = '#F59E0B',
  fontFamily = 'Inter',
  verificationStatus = 'PENDING',
  cacType = 'LIMITED_COMPANY',
  registrationNumber,
  reviewedAt,
  businessEmail,
  businessPhone,
  bankName,
  accountNumber,
  accountName,
  invoiceNumber,
  issueDate,
  dueDate,
  clientName,
  lineItems = [],
  subtotal,
  taxAmount = 0,
  totalAmount,
  isPaid = false,
  isOverdue = false,
  daysOverdue,
  isCompactPreview = false,
  className = '',
}) => {
  const [copiedBank, setCopiedBank] = React.useState(false);

  const getMonogram = (name: string) => {
    if (!name) return 'QB';
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const copyBankDetails = () => {
    if (accountNumber) {
      navigator.clipboard.writeText(`${accountNumber} (${bankName})`);
      setCopiedBank(true);
      setTimeout(() => setCopiedBank(false), 2000);
    }
  };

  const fontClass =
    fontFamily === 'Montserrat'
      ? 'font-montserrat'
      : fontFamily === 'Roboto'
      ? 'font-roboto'
      : 'font-inter';

  // Render logo or monogram
  const renderLogo = (size: 'sm' | 'md' = 'md') => {
    const dim = size === 'sm' ? 'w-10 h-10 text-sm' : 'w-12 h-12 text-base';
    if (logoUrl) {
      return (
        <div
          className={`${dim} rounded-[8px] bg-white border border-[#E4E7EC] p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-xs`}
        >
          <img
            src={logoUrl}
            alt={businessName}
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
      );
    }
    return (
      <div
        style={{ backgroundColor: primaryColor }}
        className={`${dim} rounded-[8px] text-white font-bold flex items-center justify-center shrink-0 shadow-xs tracking-wider`}
      >
        {getMonogram(businessName)}
      </div>
    );
  };

  return (
    <div
      id="invoice-printable-sheet"
      className={`invoice-a4-sheet bg-white rounded-[12px] border border-[#E4E7EC] shadow-[0_4px_18px_rgba(11,18,32,0.06)] overflow-hidden transition-all ${fontClass} ${
        isCompactPreview ? 'p-4 sm:p-5 text-xs' : 'p-6 sm:p-8'
      } ${className}`}
    >
      {/* 1. CORPORATE (CLASSIC) TOP BANNER */}
      {template === 'classic' && (
        <div
          style={{ backgroundColor: primaryColor }}
          className="mx-[-1.5rem] sm:mx-[-2rem] mt-[-1.5rem] sm:mt-[-2rem] mb-6 p-4 sm:p-6 text-white flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <div className="w-10 h-10 bg-white rounded-[6px] p-1 shrink-0 overflow-hidden">
                <img
                  src={logoUrl}
                  alt={businessName}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div className="w-10 h-10 bg-white/20 rounded-[6px] text-white font-bold flex items-center justify-center shrink-0">
                {getMonogram(businessName)}
              </div>
            )}
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight">
                {businessName || 'Adaeze Foods Ltd'}
              </h2>
              <p className="text-xs text-white/80">
                {businessEmail || 'hello@adaezefoods.ng'}
              </p>
              <div className="mt-1">
                {verificationStatus === 'VERIFIED' ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-500/25 text-emerald-200 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                    <Check className="w-3 h-3 stroke-[3]" /> CAC Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-white/20 text-white/90 px-2.5 py-0.5 rounded-full">
                    Pending verification
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs uppercase tracking-widest text-white/70 block">
              INVOICE
            </span>
            <span className="text-sm sm:text-base font-extrabold tabular-nums">
              {invoiceNumber || 'INV-007'}
            </span>
          </div>
        </div>
      )}

      {/* 2. MODERN ACCENT BAR */}
      {template === 'modern' && (
        <div
          style={{ backgroundColor: primaryColor }}
          className="h-1.5 w-full mx-[-1.5rem] sm:mx-[-2rem] mt-[-1.5rem] sm:mt-[-2rem] mb-6"
        />
      )}

      {/* Header section for Modern & Minimal */}
      {template !== 'classic' && (
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            {renderLogo(isCompactPreview ? 'sm' : 'md')}
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0B1220] tracking-tight">
                {businessName || 'Business Name'}
              </h2>
              {businessEmail && (
                <p className="text-xs text-[#667085]">{businessEmail}</p>
              )}
            </div>
          </div>

          <div className="text-right">
            <h1 className="text-base sm:text-xl font-extrabold tracking-tight text-[#0B1220] uppercase">
              INVOICE
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-[#667085] tabular-nums">
              {invoiceNumber || 'INV-001'}
            </p>
          </div>
        </div>
      )}

      {/* Trust & Verification Credential for Modern & Minimal */}
      {template !== 'classic' && (
        <div className="mb-5 flex items-center justify-between flex-wrap gap-2">
          <TrustBadge
            status={verificationStatus}
            registrationNumber={registrationNumber}
            cacType={cacType}
            reviewedAt={reviewedAt}
          />

          <div className="flex items-center gap-4 text-xs text-[#667085] tabular-nums">
            <div>
              <span className="text-[#98A2B3]">Issued:</span>{' '}
              <span className="font-semibold text-[#0B1220]">
                {formatDate(issueDate) || 'Today'}
              </span>
            </div>
            <div>
              <span className="text-[#98A2B3]">Due:</span>{' '}
              <span className="font-semibold text-[#0B1220]">
                {formatDate(dueDate) || 'In 7 days'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Paid or Overdue Alert Banner */}
      {isPaid && (
        <div className="mb-5 p-3 rounded-[8px] bg-[#E8F8EE] border border-[#16A34A]/30 text-[#16A34A] flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>INVOICE PAID IN FULL</span>
        </div>
      )}

      {!isPaid && isOverdue && (
        <div className="mb-5 p-3 rounded-[8px] bg-[#FEF3F2] border border-[#DC3E3E]/30 text-[#DC3E3E] flex items-center justify-between text-xs font-bold">
          <span>PAYMENT OVERDUE</span>
          {daysOverdue && <span>{daysOverdue} days past due date</span>}
        </div>
      )}

      {/* Billed to & Dates Row */}
      {template === 'classic' ? (
        <div className="mb-6 flex items-start justify-between gap-4 pb-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#98A2B3] block mb-1">
              BILLED TO
            </span>
            <div className="text-sm sm:text-base font-bold text-[#0B1220]">
              {clientName || 'Valued Client'}
            </div>
          </div>
          <div className="text-right text-xs text-[#667085] space-y-1">
            <div>
              <span className="text-[#98A2B3]">Issued:</span>{' '}
              <span className="font-semibold text-[#0B1220]">
                {formatDate(issueDate) || '19 Sep 2026'}
              </span>
            </div>
            <div>
              <span className="text-[#98A2B3]">Due:</span>{' '}
              <span className="font-semibold text-[#0B1220]">
                {formatDate(dueDate) || '21 Sep 2026'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-3.5 rounded-[8px] bg-[#F9FAFB] border border-[#E4E7EC]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#98A2B3] block mb-1">
            BILLED TO
          </span>
          <div className="text-sm font-bold text-[#0B1220]">
            {clientName || 'Valued Client'}
          </div>
        </div>
      )}

      {/* Line Items Table */}
      <div className="mb-6 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E4E7EC] text-[11px] font-semibold uppercase tracking-wider text-[#667085]">
              <th className="pb-2 text-left">ITEM</th>
              <th className="pb-2 text-center w-16">QTY</th>
              <th className="pb-2 text-right w-24">RATE</th>
              <th className="pb-2 text-right w-28">TOTAL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F2F4F7] text-xs sm:text-sm">
            {lineItems.length > 0 ? (
              lineItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#FAFAFA]">
                  <td className="py-3 font-medium text-[#0B1220]">
                    {item.description}
                  </td>
                  <td className="py-3 text-center tabular-nums text-[#667085]">
                    {item.quantity}
                  </td>
                  <td className="py-3 text-right tabular-nums text-[#667085]">
                    {formatMoney(item.unitPrice)}
                  </td>
                  <td className="py-3 text-right font-bold tabular-nums text-[#0B1220]">
                    {formatMoney(item.total)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-4 text-center text-xs text-[#98A2B3]">
                  No items specified yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Totals Calculation */}
      <div className="flex flex-col items-end gap-1.5 mb-6 pt-2 border-t border-[#E4E7EC]">
        <div className="flex items-center justify-between w-48 text-xs text-[#667085] tabular-nums">
          <span>Subtotal</span>
          <span className="font-semibold text-[#0B1220]">
            {formatMoney(subtotal)}
          </span>
        </div>
        {taxAmount > 0 && (
          <div className="flex items-center justify-between w-48 text-xs text-[#667085] tabular-nums">
            <span>Tax</span>
            <span className="font-semibold text-[#0B1220]">
              {formatMoney(taxAmount)}
            </span>
          </div>
        )}
        <div
          style={{ borderTopColor: secondaryColor }}
          className="flex items-center justify-between w-56 pt-2 mt-1 border-t-2 tabular-nums"
        >
          <span className="text-xs sm:text-sm font-bold text-[#0B1220]">
            Total due
          </span>
          <span className="text-base sm:text-lg font-extrabold text-[#0B1220]">
            {formatMoney(totalAmount)}
          </span>
        </div>
      </div>

      {/* Pay by bank transfer block */}
      {bankName && accountNumber && (
        <div className="p-3.5 sm:p-4 rounded-[8px] bg-[#FAFAFA] border border-[#E4E7EC] flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#667085] block mb-0.5">
              Pay by bank transfer
            </span>
            <p className="text-xs sm:text-sm font-semibold text-[#0B1220] truncate">
              {bankName} · <span className="tabular-nums">{accountNumber}</span>
              {accountName && ` · ${accountName}`}
            </p>
            <p className="text-[11px] text-[#667085] mt-0.5">
              Ref: <span className="font-semibold">{invoiceNumber}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={copyBankDetails}
            className="px-3 py-1.5 rounded-[6px] border border-[#E4E7EC] bg-white text-xs font-semibold text-[#344054] hover:bg-[#F2F4F7] transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-2xs"
          >
            {copiedBank ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                <span className="text-[#16A34A]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#667085]" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Footer support contact */}
      {(businessEmail || businessPhone) && (
        <div className="mt-6 pt-4 border-t border-[#F2F4F7] flex flex-wrap items-center justify-between text-[11px] text-[#98A2B3]">
          <div>
            Questions? Contact {businessName}: {businessEmail}{' '}
            {businessPhone && `· ${businessPhone}`}
          </div>
          <div className="font-medium text-[#667085]">
            Created with QUICKBILL
          </div>
        </div>
      )}
    </div>
  );
};
