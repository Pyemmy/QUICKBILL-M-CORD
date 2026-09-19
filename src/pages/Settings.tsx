import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Building2,
  Palette,
  ShieldCheck,
  Save,
  Check,
  AlertTriangle,
  Clock,
  Info,
  CreditCard,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { Tabs, TabItem } from '../components/Tabs';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Button } from '../components/Button';
import { FileDropzone } from '../components/FileDropzone';
import { RadioCard } from '../components/RadioCard';
import { InvoiceTemplate } from '../components/InvoiceTemplate';
import { NIGERIAN_BANKS } from '../lib/banks';
import { CacType, TemplateLayout } from '../types';
import { useToast } from '../components/Toast';

export const Settings: React.FC = () => {
  const { business, refreshProfile } = useAuth();
  const { success, error: toastError } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get('tab') as 'business' | 'brand' | 'verification' | 'payment';
  const [activeTab, setActiveTab] = useState<'business' | 'brand' | 'verification' | 'payment'>(
    tabParam || 'business'
  );
  const [isSaving, setIsSaving] = useState(false);

  // Business fields
  const [businessName, setBusinessName] = useState(business?.businessName || '');
  const [ownerName, setOwnerName] = useState(business?.ownerName || '');
  const [email, setEmail] = useState(business?.email || '');
  const [phone, setPhone] = useState(business?.phone || '');

  // Payment details
  const [bankName, setBankName] = useState(business?.bankName || '');
  const [accountNumber, setAccountNumber] = useState(business?.accountNumber || '');
  const [accountName, setAccountName] = useState(business?.accountName || '');

  // Brand fields
  const [logoUrl, setLogoUrl] = useState(business?.logoUrl || '');
  const [primaryColor, setPrimaryColor] = useState(business?.primaryColor || '#1E3A8A');
  const [secondaryColor, setSecondaryColor] = useState(business?.secondaryColor || '#F59E0B');
  const [fontFamily, setFontFamily] = useState<'Inter' | 'Roboto' | 'Montserrat'>(
    (business?.fontFamily as any) || 'Inter'
  );
  const [templateLayout, setTemplateLayout] = useState<TemplateLayout>(
    business?.templateLayout || 'modern'
  );

  // CAC fields
  const [cacType, setCacType] = useState<CacType>(business?.cacType || 'LIMITED_COMPANY');
  const [registrationNumber, setRegistrationNumber] = useState(
    business?.registrationNumber || ''
  );
  const [cacDocumentUrl, setCacDocumentUrl] = useState(business?.cacDocumentUrl || '');
  const [cacFileName, setCacFileName] = useState(business?.cacFileName || '');

  useEffect(() => {
    if (tabParam && ['business', 'brand', 'verification', 'payment'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    if (business) {
      setBusinessName(business.businessName || '');
      setOwnerName(business.ownerName || '');
      setEmail(business.email || '');
      setPhone(business.phone || '');
      setBankName(business.bankName || '');
      setAccountNumber(business.accountNumber || '');
      setAccountName(business.accountName || '');
      setLogoUrl(business.logoUrl || '');
      setPrimaryColor(business.primaryColor || '#1E3A8A');
      setSecondaryColor(business.secondaryColor || '#F59E0B');
      setFontFamily((business.fontFamily as any) || 'Inter');
      setTemplateLayout(business.templateLayout || 'modern');
      setCacType(business.cacType || 'LIMITED_COMPANY');
      setRegistrationNumber(business.registrationNumber || '');
      setCacDocumentUrl(business.cacDocumentUrl || '');
      setCacFileName(business.cacFileName || '');
    }
  }, [business]);

  const handleTabChange = (id: string) => {
    setActiveTab(id as any);
    setSearchParams({ tab: id });
  };

  const handleSaveBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.updateProfile({
        businessName,
        ownerName,
        email,
        phone,
      });
      await refreshProfile();
      success('Settings saved', 'Business details updated successfully');
    } catch (err: any) {
      toastError(err.message || 'Failed to save business settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (accountNumber && accountNumber.replace(/\D/g, '').length !== 10) {
      toastError('Bank account numbers in Nigeria must be exactly 10 digits');
      return;
    }

    setIsSaving(true);
    try {
      await api.updateProfile({
        bankName,
        accountNumber: accountNumber.replace(/\D/g, ''),
        accountName,
      });
      await refreshProfile();
      success('Payment details saved', 'Settlement bank account updated successfully');
    } catch (err: any) {
      toastError(err.message || 'Failed to save payment details');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveBrand = async () => {
    setIsSaving(true);
    try {
      await api.updateProfile({
        logoUrl,
        primaryColor,
        secondaryColor,
        fontFamily,
        templateLayout,
      });
      await refreshProfile();
      success('Brand updated', 'Invoices will now use your latest brand assets');
    } catch (err: any) {
      toastError(err.message || 'Failed to save brand settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitCac = async () => {
    if (!registrationNumber.trim()) {
      toastError('Registration number is required');
      return;
    }
    setIsSaving(true);
    try {
      await api.submitCac({
        cacType,
        registrationNumber: registrationNumber.trim(),
        cacDocumentUrl,
        cacFileName,
      });
      await refreshProfile();
      success('Verification submitted', 'Your details are under compliance review');
    } catch (err: any) {
      toastError(err.message || 'Failed to submit verification');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs: TabItem[] = [
    { id: 'business', label: 'Business' },
    { id: 'brand', label: 'Brand' },
    { id: 'verification', label: 'Verification' },
    { id: 'payment', label: 'Payment details' },
  ];

  return (
    <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B1220] tracking-tight">
          Brand & business
        </h1>
        <p className="text-xs sm:text-sm text-[#667085] mt-0.5">
          Manage your business identity, branding, and verification status.
        </p>
      </div>

      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={handleTabChange}
        variant="underline"
      />

      {/* TAB 1: BUSINESS */}
      {activeTab === 'business' && (
        <div className="bg-white rounded-[14px] border border-[#E4E7EC] p-6 sm:p-8 max-w-2xl shadow-[0_4px_18px_rgba(11,18,32,0.03)] animate-in fade-in duration-150">
          <form onSubmit={handleSaveBusiness} className="space-y-5">
            <div className="space-y-4">
              <Input
                label="Business name *"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
              />

              <Input
                label="Owner name *"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                required
              />

              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                label="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <div className="flex items-center gap-2 text-xs text-[#667085] pt-1">
                <Info className="w-4 h-4 text-[#4C7DFF] shrink-0" />
                <span>Currency: NGN · Multi-currency (USD, GBP, EUR): coming soon</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#F2F4F7] flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSaving}
                leftIcon={<Save className="w-4 h-4 text-[#0B1220]" />}
              >
                Save changes
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: BRAND (SPLIT SCREEN WITH LIVE PREVIEW) */}
      {activeTab === 'brand' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-150">
          {/* Left Column: Brand Controls */}
          <div className="lg:col-span-6 bg-white rounded-[14px] border border-[#E4E7EC] p-6 sm:p-8 shadow-[0_4px_18px_rgba(11,18,32,0.03)] space-y-6">
            <div>
              <label className="text-xs font-semibold text-[#344054] block mb-1.5">
                Business logo
              </label>
              <FileDropzone
                acceptText="Drop your logo here, or browse / PNG or SVG, up to 2MB"
                acceptedMimeTypes={['image/png', 'image/svg+xml', 'image/jpeg']}
                maxSizeBytes={2 * 1024 * 1024}
                value={logoUrl}
                onFileSelect={(dataUrl) => setLogoUrl(dataUrl)}
                onClear={() => setLogoUrl('')}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#344054] block mb-1.5">
                  Primary color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-9 h-9 rounded-[6px] border border-[#E4E7EC] cursor-pointer p-0.5 shrink-0"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-full h-[38px] rounded-[6px] border border-[#E4E7EC] px-2 text-xs uppercase font-mono text-[#0B1220] focus:outline-none focus:border-[#0B1220]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#344054] block mb-1.5">
                  Secondary color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-9 h-9 rounded-[6px] border border-[#E4E7EC] cursor-pointer p-0.5 shrink-0"
                  />
                  <input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-full h-[38px] rounded-[6px] border border-[#E4E7EC] px-2 text-xs uppercase font-mono text-[#0B1220] focus:outline-none focus:border-[#0B1220]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#344054] block mb-1.5">
                Invoice font
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Inter', 'Roboto', 'Montserrat'] as const).map((font) => (
                  <button
                    key={font}
                    type="button"
                    onClick={() => setFontFamily(font)}
                    className={`py-2 px-3 rounded-[8px] border text-xs font-semibold transition-all cursor-pointer ${
                      fontFamily === font
                        ? 'border-[#0B1220] bg-[#0B1220] text-white shadow-xs'
                        : 'border-[#E4E7EC] bg-white text-[#344054] hover:bg-[#FAFAFA]'
                    }`}
                  >
                    {font}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#344054] block mb-1.5">
                Invoice template
              </label>
              <div className="grid grid-cols-3 gap-2">
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
                    onClick={() => setTemplateLayout(tpl.id as TemplateLayout)}
                    className={`py-2.5 px-3 rounded-[8px] border text-xs font-semibold transition-all cursor-pointer ${
                      templateLayout === tpl.id
                        ? 'border-[#0B1220] bg-[#0B1220] text-white shadow-xs'
                        : 'border-[#E4E7EC] bg-white text-[#344054] hover:bg-[#FAFAFA]'
                    }`}
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#F2F4F7] flex justify-end">
              <Button
                type="button"
                variant="primary"
                size="md"
                isLoading={isSaving}
                onClick={handleSaveBrand}
                leftIcon={<Save className="w-4 h-4 text-[#0B1220]" />}
              >
                Save brand
              </Button>
            </div>
          </div>

          {/* Right Column: Live Sheet Preview */}
          <div className="lg:col-span-6 sticky top-8 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                LIVE PREVIEW
              </span>
              <span className="text-[11px] text-[#98A2B3]">
                Updates in real-time
              </span>
            </div>

            <div className="bg-[#F5F2EA] rounded-[14px] p-4 sm:p-6 border border-[#E4E7EC]/80 shadow-[0_2px_12px_rgba(11,18,32,0.03)]">
              <InvoiceTemplate
                template={templateLayout}
                businessName={businessName || 'Adaeze Foods Ltd'}
                logoUrl={logoUrl}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                fontFamily={fontFamily}
                verificationStatus={business?.verificationStatus || 'PENDING'}
                registrationNumber={registrationNumber || '1234567'}
                cacType={cacType}
                invoiceNumber="INV-001"
                issueDate="2026-09-19"
                dueDate="2026-09-26"
                clientName="Chief Okafor"
                bankName={bankName || 'Guaranty Trust Bank (GTBank)'}
                accountNumber={accountNumber || '0123456789'}
                accountName={accountName || businessName || 'Adaeze Foods Ltd'}
                lineItems={[
                  { description: 'Bag of premium rice', quantity: 3, unitPrice: 15000, total: 45000 },
                  { description: 'Dispatch Logistics', quantity: 1, unitPrice: 5000, total: 5000 },
                ]}
                subtotal={50000}
                taxAmount={0}
                totalAmount={50000}
                isCompactPreview={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: VERIFICATION */}
      {activeTab === 'verification' && (
        <div className="bg-white rounded-[14px] border border-[#E4E7EC] p-6 sm:p-8 max-w-2xl shadow-[0_4px_18px_rgba(11,18,32,0.03)] space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-base font-bold text-[#0B1220]">
                CAC Verification
              </h2>
              <p className="text-xs text-[#667085] mt-0.5">
                Verified status is displayed on your shared invoice sheets.
              </p>
            </div>

            {business?.verificationStatus === 'VERIFIED' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#E8F8EE] text-[#16A34A] text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>CAC VERIFIED</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#FEF6EE] text-[#B54708] text-xs font-bold border border-[#FECDCA]">
                <Clock className="w-3.5 h-3.5" />
                <span>PENDING REVIEW</span>
              </span>
            )}
          </div>

          {business?.verificationStatus === 'PENDING' && (
            <div className="p-3.5 rounded-[8px] bg-[#FEF6EE] border border-[#FECDCA] text-xs text-[#B54708] flex items-start gap-2.5">
              <Clock className="w-4 h-4 shrink-0 text-[#B54708] mt-0.5" />
              <p className="leading-relaxed">
                Your CAC certificate is under review. We'll notify you once approved.
              </p>
            </div>
          )}

          <div className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-[#344054] block mb-2">
                Business type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { value: 'BUSINESS_NAME', label: 'Business Name', sub: 'BN number' },
                  { value: 'LIMITED_COMPANY', label: 'Limited Company', sub: 'RC number' },
                  { value: 'INCORPORATED_TRUSTEE', label: 'Incorporated Trustee', sub: 'RC number' },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setCacType(item.value as CacType)}
                    className={`p-3 rounded-[8px] border text-left cursor-pointer transition-all ${
                      cacType === item.value
                        ? 'border-[#0B1220] bg-[#FAFAFA] ring-1 ring-[#0B1220]'
                        : 'border-[#E4E7EC] bg-white hover:border-[#D0D5DD]'
                    }`}
                  >
                    <span className="text-xs font-bold text-[#0B1220] block">
                      {item.label}
                    </span>
                    <span className="text-[11px] text-[#667085]">
                      {item.sub}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <Input
              label={cacType === 'BUSINESS_NAME' ? 'BN number' : 'RC number'}
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              placeholder="1234567"
            />

            <div>
              <label className="text-xs font-semibold text-[#344054] block mb-1.5">
                CAC certificate
              </label>
              <FileDropzone
                acceptText="Upload your CAC certificate / PDF, JPG or PNG"
                acceptedMimeTypes={['application/pdf', 'image/jpeg', 'image/png']}
                maxSizeBytes={2 * 1024 * 1024}
                value={cacDocumentUrl}
                fileName={cacFileName}
                onFileSelect={(dataUrl, file) => {
                  setCacDocumentUrl(dataUrl);
                  setCacFileName(file.name);
                }}
                onClear={() => {
                  setCacDocumentUrl('');
                  setCacFileName('');
                }}
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-[#98A2B3] pt-1">
              <Info className="w-4 h-4 shrink-0" />
              <span>Instant verification: coming soon</span>
            </div>

            <div className="pt-4 border-t border-[#F2F4F7] flex justify-end">
              <Button
                type="button"
                variant="primary"
                size="md"
                isLoading={isSaving}
                onClick={handleSubmitCac}
              >
                Submit for review
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PAYMENT DETAILS */}
      {activeTab === 'payment' && (
        <div className="bg-white rounded-[14px] border border-[#E4E7EC] p-6 sm:p-8 max-w-2xl shadow-[0_4px_18px_rgba(11,18,32,0.03)] animate-in fade-in duration-150">
          <form onSubmit={handleSavePayment} className="space-y-5">
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-bold text-[#0B1220]">
                  Settlement Bank Account
                </h2>
                <p className="text-xs text-[#667085] mt-0.5">
                  Your settlement account appears on the invoice payment instructions.
                </p>
              </div>

              <Select
                label="Bank Name"
                isSearchable={true}
                options={NIGERIAN_BANKS.map((b) => ({
                  value: b.name,
                  label: b.name,
                  description: b.isFintech ? 'Fintech / Microfinance' : 'Commercial Bank',
                }))}
                value={bankName}
                onChange={(val) => setBankName(val)}
                placeholder="Select Nigerian bank..."
              />

              <Input
                label="Account Number (10 Digits)"
                placeholder="0123456789"
                maxLength={10}
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
              />

              <Input
                label="Account Holder Name"
                placeholder="e.g. Adaeze Foods Ltd"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
              />
            </div>

            <div className="pt-4 border-t border-[#F2F4F7] flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSaving}
                leftIcon={<Save className="w-4 h-4 text-[#0B1220]" />}
              >
                Save payment details
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
