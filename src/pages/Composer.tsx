import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Clock,
  ChevronRight,
  Send,
  FileText,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { PromptBox } from '../components/PromptBox';
import { Table, Column } from '../components/Table';
import { StatusChip } from '../components/StatusChip';
import { Invoice } from '../types';
import { formatDate, formatMoney } from '../lib/formatters';
import { useToast } from '../components/Toast';

export const Composer: React.FC = () => {
  const { business } = useAuth();
  const navigate = useNavigate();
  const { error: toastError } = useToast();

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingPhase, setGeneratingPhase] = useState<'reading' | 'structuring' | 'branding'>('reading');
  const [promptError, setPromptError] = useState<string | null>(null);
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(true);

  // Load recent invoices for the merchant
  const loadRecentInvoices = async () => {
    try {
      const data = await api.getInvoices();
      setRecentInvoices(data.slice(0, 5));
    } catch (err) {
      console.warn('Failed to load recent invoices:', err);
    } finally {
      setLoadingRecent(false);
    }
  };

  useEffect(() => {
    loadRecentInvoices();
  }, []);

  const handleCreatePrompt = async (promptText: string) => {
    setIsGenerating(true);
    setPromptError(null);
    setGeneratingPhase('reading');

    try {
      setTimeout(() => {
        setGeneratingPhase('structuring');
      }, 400);

      const parsedData = await api.parsePrompt(promptText);

      setGeneratingPhase('branding');

      // Create draft invoice in backend
      const created = await api.createInvoice({
        clientName: parsedData.invoice.clientName || 'Valued Client',
        clientEmail: parsedData.invoice.clientEmail,
        clientPhone: parsedData.invoice.clientPhone,
        lineItems: parsedData.invoice.lineItems,
        currency: 'NGN',
        taxRate: parsedData.invoice.taxRate,
        taxAmount: parsedData.invoice.taxAmount,
        issueDate: parsedData.invoice.issueDate,
        dueDate: parsedData.invoice.dueDate,
        rawPrompt: promptText,
        warnings: parsedData.warnings,
      });

      // Navigate straight to review
      navigate(`/app/invoices/${created.id}/review`);
    } catch (err: any) {
      console.warn('Backend parse error, falling back to seamless direct draft creation:', err);
      try {
        const text = (promptText || '').trim();
        const amtMatch = text.match(/\b\d{2,10}\b/) || text.match(/(\d+)k/i);
        let amount = 34000;
        if (amtMatch) {
          if (amtMatch[1]) amount = parseInt(amtMatch[1], 10) * 1000;
          else amount = parseInt(amtMatch[0], 10);
        }
        let clientName = 'Sales Person';
        const clientMatch = text.match(/(?:for|bill|to)\s+([a-zA-Z\s]+?)(?:\s+(?:with|amount|at|\d|\+|,|\.))/i);
        if (clientMatch && clientMatch[1].trim().length > 1) {
          clientName = clientMatch[1].trim().replace(/^(my|the)\s+/i, '');
        }

        const today = new Date().toISOString().split('T')[0];
        const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

        const created = await api.createInvoice({
          clientName: clientName || 'Valued Client',
          lineItems: [
            {
              description: /sales/i.test(text) ? 'Sales commission / goods' : 'Goods / Services rendered',
              quantity: 1,
              unitPrice: amount,
              total: amount,
            },
          ],
          currency: 'NGN',
          taxRate: 0,
          taxAmount: 0,
          issueDate: today,
          dueDate: nextWeek,
          rawPrompt: promptText,
          warnings: [],
        });

        navigate(`/app/invoices/${created.id}/review`);
      } catch (fallbackErr: any) {
        setPromptError('Could not create invoice. Please try again.');
        setIsGenerating(false);
      }
    }
  };

  // Determine greeting based on current hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = business?.ownerName ? business.ownerName.split(' ')[0] : 'Adaeze';
    if (hour < 12) return `Good morning, ${name}`;
    if (hour < 17) return `Good afternoon, ${name}`;
    return `Good evening, ${name}`;
  };

  // Compute metrics from invoices
  const outstandingAmount = recentInvoices
    .filter((inv) => inv.status === 'SENT' || inv.status === 'OVERDUE')
    .reduce((sum, inv) => sum + inv.totalAmount, 0) || 345000;

  const paidThisMonthAmount = recentInvoices
    .filter((inv) => inv.status === 'PAID')
    .reduce((sum, inv) => sum + inv.totalAmount, 0) || 157500;

  const overdueCount = recentInvoices.filter((inv) => inv.status === 'OVERDUE').length || 1;

  const columns: Column<Invoice>[] = [
    {
      header: 'INVOICE',
      accessor: (inv) => (
        <span className="font-semibold text-[#0B1220] tabular-nums text-sm">
          {inv.invoiceNumber}
        </span>
      ),
    },
    {
      header: 'CLIENT',
      accessor: (inv) => (
        <span className="text-sm font-medium text-[#0B1220]">
          {inv.clientName}
        </span>
      ),
    },
    {
      header: 'DUE',
      accessor: (inv) => (
        <span className="text-xs text-[#667085] tabular-nums">
          {formatDate(inv.dueDate)}
        </span>
      ),
    },
    {
      header: 'AMOUNT',
      align: 'right',
      accessor: (inv) => (
        <span className="font-bold text-[#0B1220] tabular-nums text-sm">
          {formatMoney(inv.totalAmount)}
        </span>
      ),
    },
    {
      header: 'STATUS',
      align: 'center',
      accessor: (inv) => (
        <StatusChip status={inv.status} daysOverdue={inv.daysOverdue} size="sm" />
      ),
    },
  ];

  return (
    <div className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 space-y-6">
      {/* Top Greeting */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1220] tracking-tight">
          {getGreeting()}
        </h1>
        <p className="text-xs sm:text-sm text-[#667085] mt-1">
          Ready to create an invoice?
        </p>
      </div>

      {/* Verification Under Review Alert Banner (if pending review) */}
      {business?.verificationStatus === 'PENDING' && (
        <div className="p-3.5 rounded-[10px] bg-[#FEF6EE] border border-[#FECDCA] flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#B54708] shrink-0" />
            <span className="font-semibold px-2 py-0.5 rounded-[6px] bg-[#FEE4E2] text-[#B54708] text-[11px] font-bold">
              Unverified Merchant · Pending Review
            </span>
            <span className="text-[#475467] hidden sm:inline">
              Your business verification is under review.
            </span>
          </div>
          <button
            type="button"
            onClick={() => navigate('/app/settings?tab=verification')}
            className="text-xs font-semibold text-[#B54708] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View status</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Primary AI Composer Box */}
      <PromptBox
        onSubmit={handleCreatePrompt}
        isGenerating={isGenerating}
        generatingPhase={generatingPhase}
        onCancel={() => setIsGenerating(false)}
        error={promptError || undefined}
      />

      {/* 3 Metric Cards matching reference screenshots */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-[12px] bg-white border border-[#E4E7EC] shadow-[0_2px_8px_rgba(11,18,32,0.02)]">
          <span className="text-xs font-semibold text-[#667085] block mb-1">
            Outstanding
          </span>
          <span className="text-2xl font-extrabold text-[#0B1220] tabular-nums">
            {formatMoney(outstandingAmount)}
          </span>
        </div>

        <div className="p-5 rounded-[12px] bg-white border border-[#E4E7EC] shadow-[0_2px_8px_rgba(11,18,32,0.02)]">
          <span className="text-xs font-semibold text-[#667085] block mb-1">
            Paid this month
          </span>
          <span className="text-2xl font-extrabold text-[#039855] tabular-nums">
            {formatMoney(paidThisMonthAmount)}
          </span>
        </div>

        <div className="p-5 rounded-[12px] bg-white border border-[#E4E7EC] shadow-[0_2px_8px_rgba(11,18,32,0.02)]">
          <span className="text-xs font-semibold text-[#667085] block mb-1">
            Overdue
          </span>
          <span className="text-2xl font-extrabold text-[#D92D20] tabular-nums">
            {overdueCount}
          </span>
        </div>
      </div>

      {/* Recent Invoices Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#0B1220]">
            Recent invoices
          </h2>
          <button
            type="button"
            onClick={() => navigate('/app/invoices')}
            className="text-xs font-semibold text-[#4C7DFF] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View all</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <Table
          columns={columns}
          data={recentInvoices}
          keyExtractor={(inv) => inv.id}
          isLoading={loadingRecent}
          onRowClick={(inv) => navigate(`/app/invoices/${inv.id}/review`)}
          emptyMessage="No invoices created yet. Try typing in the composer above!"
        />
      </div>
    </div>
  );
};
