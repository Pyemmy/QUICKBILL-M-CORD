import React from 'react';
import { HelpCircle, ShieldCheck, Sparkles, MessageSquare, ExternalLink } from 'lucide-react';
import { Button } from '../components/Button';

export const Help: React.FC = () => {
  return (
    <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B1220] tracking-tight">
          Help & Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-[#667085] mt-0.5">
          Everything you need to know about QUICKBILL, CAC verification, and invoice delivery.
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-5 rounded-[12px] bg-white border border-[#E4E7EC] shadow-xs space-y-2">
          <h3 className="text-sm font-bold text-[#0B1220] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#20C494]" />
            <span>How does the AI Invoice Composer work?</span>
          </h3>
          <p className="text-xs text-[#667085] leading-relaxed">
            You can type or paste any freeform transaction description in English or Nigerian Pidgin (e.g. "Bill Chief Okafor 45k for 3 bags of rice delivered today, due in 7 days"). Our specialized backend LLM identifies the customer, line items, quantities, and dates, while running strict deterministic mathematical calculations to ensure every kobo adds up accurately.
          </p>
        </div>

        <div className="p-5 rounded-[12px] bg-white border border-[#E4E7EC] shadow-xs space-y-2">
          <h3 className="text-sm font-bold text-[#0B1220] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
            <span>What is the CAC Verified Trust Badge?</span>
          </h3>
          <p className="text-xs text-[#667085] leading-relaxed">
            The green CAC Verified badge proves to your customers that your business is registered with Nigeria's Corporate Affairs Commission. Customers can hover or click the badge on any public invoice to view your authenticated entity type, RC or BN number, and registration timestamp. This eliminates hesitation and drives faster payments.
          </p>
        </div>

        <div className="p-5 rounded-[12px] bg-white border border-[#E4E7EC] shadow-xs space-y-2">
          <h3 className="text-sm font-bold text-[#0B1220] flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#4C7DFF]" />
            <span>How do my customers pay me?</span>
          </h3>
          <p className="text-xs text-[#667085] leading-relaxed">
            Every public invoice includes a clean, high-visibility bank transfer card with 1-click copy for your 10-digit NUBAN account number, bank name, and account name. When you share via WhatsApp, QUICKBILL creates a pre-filled message with your invoice link ready to send.
          </p>
        </div>
      </div>
    </div>
  );
};
