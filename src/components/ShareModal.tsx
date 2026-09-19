import React, { useState } from 'react';
import {
  Copy,
  Check,
  Share2,
  ExternalLink,
  Printer,
  MessageSquare,
  X,
} from 'lucide-react';
import { Invoice, BusinessProfile } from '../types';
import { formatMoney, formatDate } from '../lib/formatters';
import { Button } from './Button';

export interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice;
  business: BusinessProfile | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  invoice,
  business,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  if (!isOpen) return null;

  // Construct absolute public link
  const origin = window.location.origin;
  const publicUrl = `${origin}/i/${invoice.publicId}`;

  // Pre-filled WhatsApp message as specified in prompt:
  // "Hi Chief Okafor, here's invoice INV-001 from Adaeze Foods Ltd for ₦50,000, due on 21 Sep 2026. View and pay: {url}"
  const businessName = business?.businessName || 'Merchant';
  const clientName = invoice.clientName || 'Customer';
  const formattedAmount = formatMoney(invoice.totalAmount);
  const formattedDueDate = formatDate(invoice.dueDate);

  const prefilledMessage = `Hi ${clientName}, here's invoice ${invoice.invoiceNumber} from ${businessName} for ${formattedAmount}, due on ${formattedDueDate}. View and pay: ${publicUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(prefilledMessage);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(prefilledMessage);
    const waUrl = invoice.clientPhone
      ? `https://wa.me/${invoice.clientPhone.replace(/\D/g, '')}?text=${encoded}`
      : `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0B1220]/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-[14px] bg-white border border-[#E4E7EC] shadow-[0_4px_18px_rgba(11,18,32,0.12)] p-6 z-10 animate-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#E6FAF4] text-[#27D6A3] flex items-center justify-center border border-[#27D6A3]/30">
              <Share2 className="w-5 h-5 text-[#0B1220]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0B1220] tracking-tight">
                Share Invoice {invoice.invoiceNumber}
              </h2>
              <p className="text-xs text-[#667085]">
                {invoice.clientName} · {formattedAmount}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-[6px] text-[#98A2B3] hover:text-[#0B1220] hover:bg-[#F2F4F7]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Public Link Copy Bar */}
          <div>
            <label className="text-xs font-semibold text-[#344054] block mb-1.5">
              Public Invoice Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={publicUrl}
                className="w-full h-[44px] rounded-[8px] border border-[#E4E7EC] bg-[#FAFAFA] px-3 text-xs text-[#0B1220] font-mono select-all"
              />
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={handleCopyLink}
                className="shrink-0"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-[#16A34A]" />
                    <span className="text-[#16A34A]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#667085]" />
                    <span>Copy</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* WhatsApp Direct Share */}
          <div className="p-4 rounded-[10px] bg-[#E8F8EE] border border-[#16A34A]/20 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#16A34A]">
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Client Message</span>
              </div>
              <button
                type="button"
                onClick={handleCopyMessage}
                className="text-[11px] font-semibold text-[#16A34A] hover:underline flex items-center gap-1"
              >
                {copiedMessage ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedMessage ? 'Copied text' : 'Copy message'}</span>
              </button>
            </div>
            <p className="text-xs text-[#1F2D42] bg-white/70 p-2.5 rounded-[6px] border border-[#16A34A]/20 leading-relaxed font-sans">
              {prefilledMessage}
            </p>
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleWhatsAppShare}
              className="w-full"
              leftIcon={<MessageSquare className="w-4 h-4 text-[#0B1220]" />}
            >
              Send via WhatsApp
            </Button>
          </div>

          {/* Secondary Options: View Public & Print PDF */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <a
              href={`/i/${invoice.publicId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="h-[44px] rounded-[8px] border border-[#E4E7EC] bg-white text-xs font-semibold text-[#344054] hover:bg-[#F9FAFB] transition-all flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4 text-[#667085]" />
              <span>View Public Page</span>
            </a>

            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handlePrint}
              leftIcon={<Printer className="w-4 h-4 text-[#667085]" />}
            >
              Print / Save PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
