import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
  ExternalLink,
  AlertCircle,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { api } from '../lib/api';
import { PendingVerificationItem } from '../types';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { formatDate } from '../lib/formatters';
import { useToast } from '../components/Toast';

export const AdminVerifications: React.FC = () => {
  const { success, error: toastError } = useToast();
  const [items, setItems] = useState<PendingVerificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Reject Modal state
  const [selectedForReject, setSelectedForReject] = useState<PendingVerificationItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadPendingQueue = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminVerifications();
      setItems(data);
    } catch (err: any) {
      toastError(err.message || 'Failed to load verification queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingQueue();
  }, []);

  const handleApprove = async (item: PendingVerificationItem) => {
    if (!window.confirm(`Approve CAC credentials for "${item.businessName}" (${item.registrationNumber})?`)) {
      return;
    }
    try {
      await api.submitAdminDecision(item.id, 'approve');
      success(`Approved ${item.businessName}`, 'CAC Verified trust badge is now live on their invoices');
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (err: any) {
      toastError(err.message || 'Failed to approve application');
    }
  };

  const handleConfirmReject = async () => {
    if (!selectedForReject) return;
    if (!rejectionReason.trim()) {
      toastError('Please provide a specific rejection reason for the merchant');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.submitAdminDecision(selectedForReject.id, 'reject', rejectionReason.trim());
      success(`Rejected ${selectedForReject.businessName}`, 'Merchant has been notified with the reason');
      setItems((prev) => prev.filter((i) => i.id !== selectedForReject.id));
      setSelectedForReject(null);
      setRejectionReason('');
    } catch (err: any) {
      toastError(err.message || 'Failed to submit rejection');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] bg-[#EEF2FF] text-[#4C7DFF] text-xs font-bold uppercase mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Review Desk</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B1220] tracking-tight">
            CAC Credential Verification Queue
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-0.5">
            Authenticate corporate entity registrations against CAC records before enabling Verified trust badges.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={loadPendingQueue}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Refresh Queue
        </Button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-[#667085] bg-white rounded-[12px] border border-[#E4E7EC]">
          Loading pending verifications...
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-[12px] border border-[#E4E7EC]">
          <div className="w-12 h-12 rounded-full bg-[#E8F8EE] text-[#16A34A] flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#0B1220]">
            All Caught Up!
          </h3>
          <p className="text-xs text-[#667085] mt-1 max-w-sm mx-auto">
            There are currently no merchants waiting for CAC document review.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-5 sm:p-6 rounded-[12px] bg-white border border-[#E4E7EC] shadow-[0_4px_18px_rgba(11,18,32,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 max-w-lg">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#0B1220]">
                    {item.businessName}
                  </h3>
                  <span className="px-2 py-0.5 rounded-[4px] bg-[#FEF6E7] text-[#B54708] text-[11px] font-bold">
                    {item.cacType}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-[#667085]">
                  <div>
                    <span className="text-[#98A2B3]">Registration No:</span>{' '}
                    <span className="font-semibold text-[#0B1220] tabular-nums">
                      {item.registrationNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#98A2B3]">Owner:</span>{' '}
                    <span className="font-semibold text-[#0B1220]">
                      {item.ownerName}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#98A2B3]">Contact:</span>{' '}
                    <span>{item.email} {item.phone && `· ${item.phone}`}</span>
                  </div>
                  <div>
                    <span className="text-[#98A2B3]">Submitted:</span>{' '}
                    <span>{formatDate(item.cacSubmittedAt)}</span>
                  </div>
                </div>

                {/* Certificate preview link or download */}
                {item.cacDocumentUrl && (
                  <div className="pt-1">
                    <a
                      href={item.cacDocumentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4C7DFF] hover:underline"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Uploaded Certificate ({item.cacFileName || 'Document'})</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setSelectedForReject(item);
                    setRejectionReason('');
                  }}
                  className="text-[#DC3E3E] hover:bg-[#FEF3F2] hover:border-[#DC3E3E]/30"
                  leftIcon={<XCircle className="w-4 h-4" />}
                >
                  Reject
                </Button>

                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={() => handleApprove(item)}
                  leftIcon={<CheckCircle2 className="w-4 h-4 text-[#0B1220]" />}
                >
                  Approve CAC
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {selectedForReject && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedForReject(null)}
          title={`Reject Verification: ${selectedForReject.businessName}`}
          description="Provide a clear, actionable reason so the merchant knows how to correct their submission."
        >
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#344054] block mb-1.5">
                Rejection Reason *
              </label>
              <textarea
                rows={4}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. The uploaded certificate was blurred and the RC number does not match the company name. Please re-upload a clear copy."
                className="w-full text-xs p-3 rounded-[8px] border border-[#E4E7EC] focus:outline-none focus:border-[#DC3E3E]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setSelectedForReject(null)}
              >
                Cancel
              </Button>

              <Button
                type="button"
                variant="danger"
                size="md"
                isLoading={isSubmitting}
                onClick={handleConfirmReject}
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
