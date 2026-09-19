import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  Share2,
  CheckCircle2,
  Trash2,
  ExternalLink,
  MoreVertical,
  Download,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { api } from '../lib/api';
import { Invoice, InvoiceStatus } from '../types';
import { Tabs, TabItem } from '../components/Tabs';
import { Table, Column } from '../components/Table';
import { StatusChip } from '../components/StatusChip';
import { Button } from '../components/Button';
import { ShareModal } from '../components/ShareModal';
import { useAuth } from '../context/AuthContext';
import { formatDate, formatMoney } from '../lib/formatters';
import { useToast } from '../components/Toast';

export const InvoicesList: React.FC = () => {
  const navigate = useNavigate();
  const { business } = useAuth();
  const { success, error: toastError } = useToast();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoiceForShare, setSelectedInvoiceForShare] = useState<Invoice | null>(null);

  const loadInvoices = async () => {
    try {
      const data = await api.getInvoices();
      setInvoices(data);
    } catch (err: any) {
      toastError(err.message || 'Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  // Filter invoices by tab & search
  const filteredInvoices = invoices.filter((inv) => {
    // Tab filter
    if (activeTab === 'DRAFT' && inv.status !== 'DRAFT') return false;
    if (activeTab === 'SENT' && inv.status !== 'SENT') return false;
    if (activeTab === 'PAID' && inv.status !== 'PAID') return false;
    if (activeTab === 'OVERDUE' && inv.status !== 'OVERDUE') return false;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesNum = inv.invoiceNumber.toLowerCase().includes(q);
      const matchesClient = inv.clientName.toLowerCase().includes(q);
      return matchesNum || matchesClient;
    }
    return true;
  });

  // Tab counts
  const counts = {
    ALL: invoices.length,
    DRAFT: invoices.filter((i) => i.status === 'DRAFT').length,
    SENT: invoices.filter((i) => i.status === 'SENT').length,
    PAID: invoices.filter((i) => i.status === 'PAID').length,
    OVERDUE: invoices.filter((i) => i.status === 'OVERDUE').length,
  };

  const tabs: TabItem[] = [
    { id: 'ALL', label: 'All', count: counts.ALL },
    { id: 'DRAFT', label: 'Draft', count: counts.DRAFT },
    { id: 'SENT', label: 'Sent', count: counts.SENT },
    { id: 'PAID', label: 'Paid', count: counts.PAID },
    { id: 'OVERDUE', label: 'Overdue', count: counts.OVERDUE },
  ];

  // Quick Action: Mark as Paid (with undo support in Toast)
  const handleMarkAsPaid = async (inv: Invoice, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const previousStatus = inv.status;
      const updated = await api.updateInvoice(inv.id, { status: 'PAID' });
      setInvoices((prev) => prev.map((item) => (item.id === inv.id ? updated : item)));

      success(
        `Marked ${inv.invoiceNumber} as Paid`,
        'Invoice status has been updated',
        {
          label: 'Undo',
          onClick: async () => {
            const reverted = await api.updateInvoice(inv.id, { status: previousStatus });
            setInvoices((prev) => prev.map((item) => (item.id === inv.id ? reverted : item)));
          },
        }
      );
    } catch (err: any) {
      toastError(err.message || 'Failed to update invoice');
    }
  };

  // Quick Action: Delete draft
  const handleDeleteDraft = async (inv: Invoice, e: React.MouseEvent) => {
    e.stopPropagation();
    if (inv.status !== 'DRAFT') {
      toastError('Only draft invoices can be deleted');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete ${inv.invoiceNumber}?`)) {
      return;
    }
    try {
      await api.deleteInvoice(inv.id);
      setInvoices((prev) => prev.filter((i) => i.id !== inv.id));
      success('Draft deleted', `${inv.invoiceNumber} was removed`);
    } catch (err: any) {
      toastError(err.message || 'Failed to delete draft');
    }
  };

  // Seed sample invoices
  const handleSeedInvoices = async () => {
    try {
      const res = await api.seedDemoInvoices();
      await loadInvoices();
      success('Demo invoices seeded', `Added ${res.count} sample invoices`);
    } catch (err: any) {
      toastError(err.message || 'Failed to seed invoices');
    }
  };

  const columns: Column<Invoice>[] = [
    {
      header: 'INVOICE & CLIENT',
      accessor: (inv) => (
        <div>
          <span className="font-semibold text-[#0B1220] tabular-nums text-sm">
            {inv.invoiceNumber}
          </span>
          <p className="text-xs text-[#667085] mt-0.5">{inv.clientName}</p>
        </div>
      ),
    },
    {
      header: 'DATE ISSUED',
      accessor: (inv) => (
        <span className="text-xs text-[#667085] tabular-nums">
          {formatDate(inv.issueDate)}
        </span>
      ),
    },
    {
      header: 'DUE DATE',
      accessor: (inv) => (
        <span className="text-xs text-[#667085] tabular-nums">
          {formatDate(inv.dueDate)}
        </span>
      ),
    },
    {
      header: 'TOTAL AMOUNT',
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
    {
      header: 'ACTIONS',
      align: 'right',
      accessor: (inv) => (
        <div
          className="flex items-center justify-end gap-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          {inv.status !== 'DRAFT' && (
            <button
              type="button"
              onClick={() => setSelectedInvoiceForShare(inv)}
              className="p-1.5 rounded-[6px] hover:bg-[#F2F4F7] text-[#667085] hover:text-[#0B1220]"
              title="Share invoice"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}

          {inv.status !== 'PAID' && inv.status !== 'DRAFT' && (
            <button
              type="button"
              onClick={(e) => handleMarkAsPaid(inv, e)}
              className="p-1.5 rounded-[6px] hover:bg-[#E8F8EE] text-[#16A34A]"
              title="Mark as paid"
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}

          {inv.status === 'DRAFT' && (
            <button
              type="button"
              onClick={(e) => handleDeleteDraft(inv, e)}
              className="p-1.5 rounded-[6px] hover:bg-[#FEF3F2] text-[#DC3E3E]"
              title="Delete draft"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B1220] tracking-tight">
            Invoices
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-0.5">
            Manage, track payment statuses, and share links with your customers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSeedInvoices}
            className="text-xs"
          >
            Seed Demo Invoices
          </Button>

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => navigate('/app')}
            leftIcon={<Sparkles className="w-4 h-4 text-[#0B1220]" />}
          >
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Tabs & Search Bar */}
      <div className="bg-white rounded-[12px] border border-[#E4E7EC] p-4 shadow-[0_4px_18px_rgba(11,18,32,0.02)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={(id) => setActiveTab(id)}
            variant="pill"
          />

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#98A2B3]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search invoices..."
              className="w-full h-9 pl-9 pr-3 text-xs bg-[#F9FAFB] border border-[#E4E7EC] rounded-[8px] focus:outline-none focus:border-[#0B1220] focus:bg-white"
            />
          </div>
        </div>

        {/* Invoices Table */}
        <Table
          columns={columns}
          data={filteredInvoices}
          keyExtractor={(inv) => inv.id}
          isLoading={loading}
          onRowClick={(inv) => navigate(`/app/invoices/${inv.id}/review`)}
          emptyMessage="No invoices match your filter criteria."
        />
      </div>

      {/* Share Modal Dialog */}
      {selectedInvoiceForShare && (
        <ShareModal
          isOpen={true}
          onClose={() => setSelectedInvoiceForShare(null)}
          invoice={selectedInvoiceForShare}
          business={business}
        />
      )}
    </div>
  );
};
