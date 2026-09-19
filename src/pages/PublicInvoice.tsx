import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Printer,
  Copy,
  Check,
  Building2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { api } from '../lib/api';
import { PublicInvoiceData } from '../types';
import { InvoiceTemplate } from '../components/InvoiceTemplate';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';
import { Skeleton } from '../components/Skeleton';

export const PublicInvoice: React.FC = () => {
  const { publicId } = useParams<{ publicId: string }>();
  const [data, setData] = useState<PublicInvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPublicInvoice() {
      if (!publicId) return;
      try {
        const res = await api.getPublicInvoice(publicId);
        setData(res);
      } catch (err: any) {
        setError(err.message || 'Invoice not found or no longer available');
      } finally {
        setLoading(false);
      }
    }
    loadPublicInvoice();
  }, [publicId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F2EA] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-[14px] p-8 border border-[#E4E7EC] space-y-4">
          <Skeleton height={32} width={200} />
          <Skeleton height={20} width={150} />
          <div className="pt-6 space-y-3">
            <Skeleton height={40} />
            <Skeleton height={40} />
            <Skeleton height={40} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#F5F2EA] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-full max-w-md bg-white rounded-[14px] p-8 border border-[#E4E7EC] shadow-sm">
          <div className="w-12 h-12 rounded-full bg-[#FEF3F2] text-[#DC3E3E] flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#0B1220] tracking-tight">
            Invoice Not Available
          </h2>
          <p className="text-xs text-[#667085] mt-1 mb-6 leading-relaxed">
            {error || 'This invoice does not exist, has expired, or is still a draft.'}
          </p>
          <Link to="/">
            <Button variant="primary" size="md">
              Go to QUICKBILL Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { invoice, merchant, verification } = data;

  return (
    <div className="min-h-screen bg-[#F5F2EA] flex flex-col">
      {/* Top Navbar */}
      <header className="no-print bg-white/80 backdrop-blur-md border-b border-[#E4E7EC] sticky top-0 z-20 px-4 sm:px-8 py-3 flex items-center justify-between">
        <Link to="/" className="inline-block">
          <Logo size="sm" showTagline={false} />
        </Link>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="w-3.5 h-3.5" />}
          >
            Download / Print
          </Button>

          <Link to="/login" className="hidden sm:inline-block">
            <Button variant="primary" size="sm">
              Create My Invoices
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Centered Paper Invoice Sheet */}
      <div className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-8 flex flex-col items-center">
        <div className="w-full">
          <InvoiceTemplate
            template={merchant.templateLayout}
            businessName={merchant.businessName}
            logoUrl={merchant.logoUrl}
            primaryColor={merchant.primaryColor}
            secondaryColor={merchant.secondaryColor}
            fontFamily={merchant.fontFamily}
            verificationStatus={verification.status}
            registrationNumber={verification.registrationNumber}
            cacType={verification.cacType}
            reviewedAt={verification.reviewedAt}
            businessEmail={merchant.email}
            businessPhone={merchant.phone}
            bankName={merchant.bankName}
            accountNumber={merchant.accountNumber}
            accountName={merchant.accountName}
            invoiceNumber={invoice.invoiceNumber}
            issueDate={invoice.issueDate}
            dueDate={invoice.dueDate}
            clientName={invoice.clientName}
            lineItems={invoice.lineItems}
            subtotal={invoice.subtotal}
            taxRate={invoice.taxRate}
            taxAmount={invoice.taxAmount}
            totalAmount={invoice.totalAmount}
            isPaid={invoice.status === 'PAID'}
            isOverdue={invoice.status === 'OVERDUE'}
            daysOverdue={invoice.daysOverdue}
          />
        </div>

        {/* Security & Verification trust footnote */}
        <div className="no-print mt-8 text-center text-xs text-[#667085] space-y-1">
          <p className="flex items-center justify-center gap-1.5 font-medium text-[#0B1220]">
            <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
            <span>Authenticated invoice generated with QUICKBILL</span>
          </p>
          <p className="text-[#98A2B3] text-[11px]">
            Security Verified · Real-Time Merchant Registry Check · Central Bank of Nigeria Standards
          </p>
        </div>
      </div>
    </div>
  );
};
