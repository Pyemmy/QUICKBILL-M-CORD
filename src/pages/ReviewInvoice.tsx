import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Send,
  Save,
  AlertTriangle,
  Sparkles,
  Share2,
  Info,
  Check,
  Clock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { Invoice, LineItem, TemplateLayout } from '../types';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { InvoiceTemplate } from '../components/InvoiceTemplate';
import { ShareModal } from '../components/ShareModal';
import { formatDate, formatMoney } from '../lib/formatters';
import { useToast } from '../components/Toast';

export const ReviewInvoice: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { business } = useAuth();
  const { success, error: toastError } = useToast();

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Template preview selection
  const [activeTemplate, setActiveTemplate] = useState<TemplateLayout>(
    business?.templateLayout || 'classic'
  );

  // Prompt editing state
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState('');
  const [isReParsing, setIsReParsing] = useState(false);

  // Form states
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [taxRate, setTaxRate] = useState<number>(0);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);

  useEffect(() => {
    async function loadInvoice() {
      if (!id) return;
      try {
        const inv = await api.getInvoice(id);
        setInvoice(inv);
        setClientName(inv.clientName);
        setClientEmail(inv.clientEmail || '');
        setClientPhone(inv.clientPhone || '');
        setIssueDate(inv.issueDate);
        setDueDate(inv.dueDate);
        setTaxRate(inv.taxRate || 0);
        setLineItems(inv.lineItems || []);
        setEditedPrompt(inv.rawPrompt || '');
        if (business?.templateLayout) {
          setActiveTemplate(business.templateLayout);
        }
      } catch (err: any) {
        toastError(err.message || 'Failed to load invoice');
      } finally {
        setLoading(false);
      }
    }
    loadInvoice();
  }, [id, business?.templateLayout]);

  // Recalculate totals dynamically
  const subtotal = lineItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const totalAmount = subtotal + taxAmount;

  // Helper text for due date
  const getDueHelperText = () => {
    if (!issueDate || !dueDate) return '';
    const d1 = new Date(issueDate);
    const d2 = new Date(dueDate);
    const diffDays = Math.round((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24));
    const formattedDue = formatDate(dueDate);
    if (diffDays === 0) return `Due today = ${formattedDue}`;
    if (diffDays === 1) return `Due in 1 day = ${formattedDue}`;
    if (diffDays > 0) return `Due in ${diffDays} days = ${formattedDue}`;
    return `Overdue by ${Math.abs(diffDays)} days = ${formattedDue}`;
  };

  const handleUpdateItem = (index: number, field: keyof LineItem, value: any) => {
    setLineItems((prev) => {
      const copy = [...prev];
      const current = { ...copy[index] };
      if (field === 'quantity') {
        current.quantity = Math.max(1, Number(value) || 1);
      } else if (field === 'unitPrice') {
        current.unitPrice = Math.max(0, Number(value) || 0);
      } else {
        (current as any)[field] = value;
      }
      current.total = current.quantity * current.unitPrice;
      copy[index] = current;
      return copy;
    });
  };

  const handleAddItem = () => {
    setLineItems((prev) => [
      ...prev,
      { description: '', quantity: 1, unitPrice: 0, total: 0 },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (lineItems.length <= 1) {
      toastError('Invoice must contain at least one line item');
      return;
    }
    setLineItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleReParsePrompt = async () => {
    if (!editedPrompt.trim() || isReParsing) return;
    setIsReParsing(true);
    try {
      const parsed = await api.parsePrompt(editedPrompt);
      if (parsed.invoice.clientName) setClientName(parsed.invoice.clientName);
      if (parsed.invoice.clientEmail) setClientEmail(parsed.invoice.clientEmail);
      if (parsed.invoice.clientPhone) setClientPhone(parsed.invoice.clientPhone);
      if (parsed.invoice.issueDate) setIssueDate(parsed.invoice.issueDate);
      if (parsed.invoice.dueDate) setDueDate(parsed.invoice.dueDate);
      if (parsed.invoice.lineItems && parsed.invoice.lineItems.length > 0) {
        setLineItems(parsed.invoice.lineItems);
      }
      setIsEditingPrompt(false);
      success('Prompt re-evaluated', 'Invoice fields refreshed based on your prompt');
    } catch (err: any) {
      toastError(err.message || 'Failed to re-parse prompt');
    } finally {
      setIsReParsing(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!id || !invoice) return;
    setIsSaving(true);
    try {
      const updated = await api.updateInvoice(id, {
        clientName,
        clientEmail: clientEmail || null,
        clientPhone: clientPhone || null,
        issueDate,
        dueDate,
        taxRate,
        taxAmount,
        lineItems,
        rawPrompt: editedPrompt || invoice.rawPrompt,
      });
      setInvoice(updated);
      success('Draft saved', 'Your changes have been preserved');
    } catch (err: any) {
      toastError(err.message || 'Failed to save draft');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendInvoice = async () => {
    if (!id || !invoice) return;
    if (!clientName.trim()) {
      toastError('Client name is required');
      return;
    }
    setIsSending(true);
    try {
      const updated = await api.updateInvoice(id, {
        status: 'SENT',
        clientName,
        clientEmail: clientEmail || null,
        clientPhone: clientPhone || null,
        issueDate,
        dueDate,
        taxRate,
        taxAmount,
        lineItems,
        rawPrompt: editedPrompt || invoice.rawPrompt,
      });
      setInvoice(updated);
      success('Invoice Created!', `Invoice ${updated.invoiceNumber} is ready to send`);
      setShowShareModal(true);
    } catch (err: any) {
      toastError(err.message || 'Failed to send invoice');
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-sm text-[#667085]">
        Loading invoice review...
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-12 text-center text-sm text-[#DC3E3E]">
        Invoice not found.
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">
      {/* Top Header Bar */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/app')}
          className="p-2 rounded-[8px] hover:bg-[#F2F4F7] text-[#667085] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B1220] tracking-tight">
            What we understood
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-0.5">
            Review and adjust before creating your invoice.
          </p>
        </div>
      </div>

      {/* Split Screen Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Review & Adjust Form */}
        <div className="lg:col-span-6 bg-white rounded-[14px] border border-[#E4E7EC] p-6 shadow-[0_4px_18px_rgba(11,18,32,0.03)] space-y-6">
          {/* 1. ORIGINAL PROMPT CARD */}
          <div className="p-4 rounded-[10px] bg-[#F9FAFB] border border-[#E4E7EC] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#667085]">
                ORIGINAL PROMPT
              </span>
              <button
                type="button"
                onClick={() => setIsEditingPrompt(!isEditingPrompt)}
                className="text-xs font-semibold text-[#4C7DFF] hover:underline cursor-pointer"
              >
                {isEditingPrompt ? 'Cancel' : 'Edit prompt'}
              </button>
            </div>

            {isEditingPrompt ? (
              <div className="space-y-2 pt-1">
                <textarea
                  rows={3}
                  value={editedPrompt}
                  onChange={(e) => setEditedPrompt(e.target.value)}
                  className="w-full text-xs text-[#0B1220] p-2 rounded-[6px] border border-[#D0D5DD] bg-white resize-none focus:outline-none focus:border-[#0B1220]"
                  placeholder="Edit your invoice prompt..."
                />
                <div className="flex justify-end">
                  <Button
                    type="button"
                    size="sm"
                    variant="primary"
                    isLoading={isReParsing}
                    onClick={handleReParsePrompt}
                  >
                    Re-extract details
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm italic text-[#0B1220] leading-relaxed">
                "{invoice.rawPrompt || editedPrompt || 'Bill Chief Okafor 45k for 3 bags of rice + 5k delivery. Due in 2 days.'}"
              </p>
            )}
          </div>

          {/* AI Extraction Warnings Banner (If any) */}
          {invoice.warnings && invoice.warnings.length > 0 && (
            <div className="p-3 rounded-[8px] bg-[#FEF6E7] border border-[#F4B740]/40 text-xs text-[#925F07] space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-3.5 h-3.5 text-[#F4B740]" />
                <span>AI Normalization</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 pl-1 text-[#925F07]/90 text-[11px]">
                {invoice.warnings.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {/* 2. CLIENT SECTION */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#667085]">
              Client
            </h3>

            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <label className="text-xs font-semibold text-[#344054]">
                  Client name *
                </label>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-[4px] bg-[#EEF4FF] text-[#3538CD]">
                  AI
                </span>
              </div>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Chief Okafor"
                className="w-full h-[40px] px-3 rounded-[8px] border border-[#D0D5DD] bg-white text-xs font-medium text-[#0B1220] focus:outline-none focus:border-[#0B1220]"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#344054] block mb-1.5">
                  Email (optional)
                </label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="okafor@example.com"
                  className="w-full h-[40px] px-3 rounded-[8px] border border-[#D0D5DD] bg-white text-xs font-medium text-[#0B1220] focus:outline-none focus:border-[#0B1220]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#344054] block mb-1.5">
                  Phone (optional)
                </label>
                <input
                  type="text"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="+234 801 234 5678"
                  className="w-full h-[40px] px-3 rounded-[8px] border border-[#D0D5DD] bg-white text-xs font-medium text-[#0B1220] focus:outline-none focus:border-[#0B1220]"
                />
              </div>
            </div>
          </div>

          {/* 3. DATES SECTION */}
          <div className="space-y-3 pt-4 border-t border-[#F2F4F7]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#667085]">
              Dates
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <label className="text-xs font-semibold text-[#344054]">
                    Issue date
                  </label>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-[4px] bg-[#EEF4FF] text-[#3538CD]">
                    AI
                  </span>
                </div>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full h-[40px] px-3 rounded-[8px] border border-[#D0D5DD] bg-white text-xs font-medium text-[#0B1220] focus:outline-none focus:border-[#0B1220]"
                />
              </div>

              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <label className="text-xs font-semibold text-[#344054]">
                    Due date
                  </label>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-[4px] bg-[#EEF4FF] text-[#3538CD]">
                    AI
                  </span>
                </div>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full h-[40px] px-3 rounded-[8px] border border-[#D0D5DD] bg-white text-xs font-medium text-[#0B1220] focus:outline-none focus:border-[#0B1220]"
                />
              </div>
            </div>

            {getDueHelperText() && (
              <p className="text-xs text-[#667085]">
                {getDueHelperText()}
              </p>
            )}
          </div>

          {/* 4. LINE ITEMS SECTION */}
          <div className="space-y-3 pt-4 border-t border-[#F2F4F7]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#667085]">
              Line items
            </h3>

            <div className="border border-[#E4E7EC] rounded-[8px] overflow-hidden bg-white">
              <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-[#F9FAFB] border-b border-[#E4E7EC] text-[11px] font-bold text-[#667085] uppercase tracking-wider">
                <div className="col-span-6">DESCRIPTION</div>
                <div className="col-span-2 text-center">QTY</div>
                <div className="col-span-2 text-right">UNIT PRICE</div>
                <div className="col-span-2 text-right">TOTAL</div>
              </div>

              <div className="divide-y divide-[#F2F4F7]">
                {lineItems.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 p-3 items-center">
                    <div className="col-span-6">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) =>
                          handleUpdateItem(idx, 'description', e.target.value)
                        }
                        placeholder="Item description"
                        className="w-full text-xs font-semibold text-[#0B1220] bg-transparent border-none outline-none focus:ring-0"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleUpdateItem(idx, 'quantity', e.target.value)
                        }
                        className="w-full h-8 px-2 rounded-[6px] border border-[#E4E7EC] bg-white text-xs text-center font-semibold tabular-nums focus:outline-none focus:border-[#0B1220]"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) =>
                          handleUpdateItem(idx, 'unitPrice', e.target.value)
                        }
                        className="w-full h-8 px-2 rounded-[6px] border border-[#E4E7EC] bg-white text-xs text-right font-semibold tabular-nums focus:outline-none focus:border-[#0B1220]"
                      />
                    </div>
                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <span className="text-xs font-bold text-[#0B1220] tabular-nums">
                        {formatMoney(item.quantity * item.unitPrice)}
                      </span>
                      {lineItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="text-[#98A2B3] hover:text-[#DC3E3E] transition-colors p-1 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2.5 border-t border-[#F2F4F7] bg-[#FAFAFA]">
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="text-xs font-semibold text-[#4C7DFF] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add item</span>
                </button>
              </div>
            </div>

            {/* Totals Summary */}
            <div className="flex flex-col items-end gap-2 pt-2">
              <div className="flex items-center justify-between w-64 text-xs text-[#667085] tabular-nums">
                <span>Subtotal</span>
                <span className="font-semibold text-[#0B1220]">
                  {formatMoney(subtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between w-64 text-xs text-[#667085] tabular-nums">
                <span>Tax (₦)</span>
                <input
                  type="number"
                  min="0"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value) || 0)}
                  className="w-16 h-7 px-2 rounded-[4px] border border-[#E4E7EC] text-right text-xs tabular-nums focus:outline-none focus:border-[#0B1220]"
                />
              </div>

              <div className="w-64 pt-2 border-t-2 border-[#1E3A8A] flex items-center justify-between tabular-nums">
                <span className="text-sm font-bold text-[#0B1220]">
                  Total due
                </span>
                <span className="text-lg font-extrabold text-[#0B1220]">
                  {formatMoney(totalAmount)}
                </span>
              </div>

              <p className="text-[11px] text-[#667085] pt-1">
                Pay by bank transfer: {business?.bankName || 'GTBank'} · {business?.accountNumber || '0123456789'} · {business?.accountName || business?.businessName || 'Adaeze Foods Ltd'} · Ref: <span className="font-semibold">{invoice.invoiceNumber}</span>
              </p>
            </div>
          </div>

          {/* 5. CALLOUT & ESCROW CARD */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-[#667085]">
              <Info className="w-4 h-4 text-[#4C7DFF] shrink-0" />
              <span>Currency: NGN · Multi-currency (USD, GBP, EUR): coming soon</span>
            </div>

            <div className="p-3.5 rounded-[8px] bg-[#F9FAFB] border border-[#E4E7EC] flex items-start gap-3 opacity-75">
              <input
                type="checkbox"
                disabled
                className="mt-0.5 rounded border-[#D0D5DD] text-[#27D6A3] focus:ring-0 cursor-not-allowed"
              />
              <div>
                <span className="text-xs font-semibold text-[#344054] block">
                  Hold payment until buyer confirms receipt (escrow)
                </span>
                <span className="text-[11px] text-[#98A2B3]">
                  Coming soon
                </span>
              </div>
            </div>
          </div>

          {/* 6. BOTTOM ACTION BUTTONS */}
          <div className="pt-4 border-t border-[#F2F4F7] flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              isLoading={isSaving}
              onClick={handleSaveDraft}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save draft
            </Button>

            <Button
              type="button"
              variant="primary"
              size="md"
              isLoading={isSending}
              onClick={handleSendInvoice}
              rightIcon={<Send className="w-4 h-4 text-[#0B1220]" />}
            >
              Create invoice
            </Button>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Invoice Sheet Preview */}
        <div className="lg:col-span-6 sticky top-8 space-y-3">
          {/* Preview Header & Template switcher pills */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#667085]">
              LIVE PREVIEW
            </span>

            {/* Template Switcher: [Modern] [Minimal] [Corporate] */}
            <div className="flex items-center gap-1 bg-[#E4E7EC]/60 p-1 rounded-[8px]">
              {(
                [
                  { id: 'modern', label: 'Modern' },
                  { id: 'minimal', label: 'Minimal' },
                  { id: 'classic', label: 'Corporate' },
                ] as const
              ).map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => setActiveTemplate(tpl.id as TemplateLayout)}
                  className={`px-3 py-1 text-xs font-semibold rounded-[6px] transition-all cursor-pointer ${
                    activeTemplate === tpl.id
                      ? 'bg-[#0B1220] text-white shadow-xs'
                      : 'text-[#667085] hover:text-[#0B1220]'
                  }`}
                >
                  {tpl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Warm Canvas Frame */}
          <div className="bg-[#F5F2EA] rounded-[14px] p-4 sm:p-6 border border-[#E4E7EC]/80 shadow-[0_2px_12px_rgba(11,18,32,0.03)]">
            <InvoiceTemplate
              template={activeTemplate}
              businessName={business?.businessName || 'Adaeze Foods Ltd'}
              logoUrl={business?.logoUrl}
              primaryColor={business?.primaryColor || '#1E3A8A'}
              secondaryColor={business?.secondaryColor || '#F59E0B'}
              fontFamily={(business?.fontFamily as any) || 'Inter'}
              verificationStatus={business?.verificationStatus || 'PENDING'}
              registrationNumber={business?.registrationNumber || '1234567'}
              cacType={business?.cacType}
              invoiceNumber={invoice.invoiceNumber}
              issueDate={issueDate}
              dueDate={dueDate}
              clientName={clientName}
              clientEmail={clientEmail}
              clientPhone={clientPhone}
              bankName={business?.bankName || 'Guaranty Trust Bank (GTBank)'}
              accountNumber={business?.accountNumber || '0123456789'}
              accountName={business?.accountName || business?.businessName || 'Adaeze Foods Ltd'}
              lineItems={lineItems}
              subtotal={subtotal}
              taxAmount={taxAmount}
              totalAmount={totalAmount}
              isPaid={invoice.status === 'PAID'}
              isOverdue={invoice.status === 'OVERDUE'}
              daysOverdue={invoice.daysOverdue}
            />
          </div>
        </div>
      </div>

      {/* Share Modal Dialog */}
      {showShareModal && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          invoice={invoice}
          business={business}
        />
      )}
    </div>
  );
};
