import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Palette,
  ShieldCheck,
  Check,
  ArrowRight,
  ArrowLeft,
  UploadCloud,
  FileText,
  AlertTriangle,
  Clock,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { CacType, TemplateLayout } from '../types';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Button } from '../components/Button';
import { FileDropzone } from '../components/FileDropzone';
import { RadioCard } from '../components/RadioCard';
import { InvoiceTemplate } from '../components/InvoiceTemplate';
import { NIGERIAN_BANKS } from '../lib/banks';
import { Logo } from '../components/Logo';
import { useToast } from '../components/Toast';

export const Onboarding: React.FC = () => {
  const { business, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSaving, setIsSaving] = useState(false);

  // Step 1 fields
  const [businessName, setBusinessName] = useState(business?.businessName || '');
  const [ownerName, setOwnerName] = useState(business?.ownerName || '');
  const [email, setEmail] = useState(business?.email || '');
  const [phone, setPhone] = useState(business?.phone || '');
  const [bankName, setBankName] = useState(business?.bankName || '');
  const [accountNumber, setAccountNumber] = useState(business?.accountNumber || '');
  const [accountName, setAccountName] = useState(business?.accountName || '');

  // Step 2 fields
  const [logoUrl, setLogoUrl] = useState(business?.logoUrl || '');
  const [primaryColor, setPrimaryColor] = useState(business?.primaryColor || '#1E3A8A');
  const [secondaryColor, setSecondaryColor] = useState(business?.secondaryColor || '#F59E0B');
  const [fontFamily, setFontFamily] = useState<'Inter' | 'Roboto' | 'Montserrat'>(
    (business?.fontFamily as any) || 'Inter'
  );
  const [templateLayout, setTemplateLayout] = useState<TemplateLayout>(
    business?.templateLayout || 'modern'
  );

  // Step 3 fields
  const [cacType, setCacType] = useState<CacType>(business?.cacType || 'LIMITED_COMPANY');
  const [registrationNumber, setRegistrationNumber] = useState(
    business?.registrationNumber || ''
  );
  const [cacDocumentUrl, setCacDocumentUrl] = useState(business?.cacDocumentUrl || '');
  const [cacFileName, setCacFileName] = useState(business?.cacFileName || '');

  useEffect(() => {
    if (business) {
      if (business.onboardingStep && business.onboardingStep >= 1 && business.onboardingStep <= 4) {
        setCurrentStep(business.onboardingStep);
      }
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

  // Bank account name auto-fill suggestion
  useEffect(() => {
    if (businessName && !accountName) {
      setAccountName(businessName);
    }
  }, [businessName, accountName]);

  const goToStep = (step: number) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 1: Save Business details
  const handleSubmitStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) {
      toastError('Please enter your business name');
      return;
    }
    if (!ownerName.trim()) {
      toastError('Please enter the owner full name');
      return;
    }
    if (accountNumber && accountNumber.replace(/\D/g, '').length !== 10) {
      toastError('Nigerian bank account numbers must be exactly 10 digits');
      return;
    }

    setIsSaving(true);
    try {
      await api.updateProfile({
        businessName: businessName.trim(),
        ownerName: ownerName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        bankName,
        accountNumber: accountNumber.replace(/\D/g, ''),
        accountName: accountName.trim(),
        onboardingStep: 2,
      });
      await refreshProfile();
      goToStep(2);
    } catch (err: any) {
      toastError(err.message || 'Failed to save business details');
    } finally {
      setIsSaving(false);
    }
  };

  // Step 2: Save Brand Kit
  const handleSubmitStep2 = async () => {
    setIsSaving(true);
    try {
      await api.updateProfile({
        logoUrl,
        primaryColor,
        secondaryColor,
        fontFamily,
        templateLayout,
        onboardingStep: 3,
      });
      await refreshProfile();
      goToStep(3);
    } catch (err: any) {
      toastError(err.message || 'Failed to save brand settings');
    } finally {
      setIsSaving(false);
    }
  };

  // Step 3: Submit CAC or Skip
  const handleSubmitStep3 = async (skip: boolean = false) => {
    setIsSaving(true);
    try {
      if (!skip) {
        if (!registrationNumber.trim()) {
          toastError('Please enter your CAC registration number or skip for now');
          setIsSaving(false);
          return;
        }
        await api.submitCac({
          cacType,
          registrationNumber: registrationNumber.trim(),
          cacDocumentUrl,
          cacFileName,
        });
      } else {
        await api.updateProfile({ onboardingStep: 4 });
      }

      await refreshProfile();
      goToStep(4);
    } catch (err: any) {
      toastError(err.message || 'Verification submission error');
    } finally {
      setIsSaving(false);
    }
  };

  // Step 4: Complete Onboarding & Navigate to App
  const handleComplete = async () => {
    setIsSaving(true);
    try {
      await api.updateProfile({
        onboardingComplete: true,
        onboardingStep: 4,
      });
      await refreshProfile();
      navigate('/app');
    } catch (err: any) {
      toastError(err.message || 'Failed to finalize setup');
    } finally {
      setIsSaving(false);
    }
  };

  const cacOptions = [
    {
      id: 'BUSINESS_NAME',
      title: 'Business Name',
      subtitle: 'BN number',
    },
    {
      id: 'LIMITED_COMPANY',
      title: 'Limited Company',
      subtitle: 'RC number',
    },
    {
      id: 'INCORPORATED_TRUSTEE',
      title: 'Incorporated Trustee',
      subtitle: 'RC number',
    },
  ];

  const steps = [
    { id: 1, label: 'Business details' },
    { id: 2, label: 'Brand kit' },
    { id: 3, label: 'CAC verification' },
    { id: 4, label: 'Status' },
  ];

  // Helper for live preview rendering on steps 2, 3, 4
  const renderLivePreview = () => (
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
          verificationStatus={
            currentStep === 4 && business?.verificationStatus === 'VERIFIED'
              ? 'VERIFIED'
              : currentStep >= 3 && registrationNumber
              ? 'PENDING'
              : 'PENDING'
          }
          registrationNumber={registrationNumber || '1234567'}
          cacType={cacType}
          invoiceNumber="INV-001"
          issueDate="2026-09-19"
          dueDate="2026-09-26"
          clientName="Chief Okafor"
          clientPhone="+234 803 123 4567"
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
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
      {/* Top Header */}
      <header className="bg-white border-b border-[#E4E7EC] py-4 px-6 sm:px-10 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Logo size="md" showTagline={true} />
        </div>

        <div className="text-xs text-[#667085] flex items-center gap-2">
          <span>Step {currentStep} of 4</span>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 space-y-8">
        {/* Step Indicator Progress Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#E4E7EC] -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-0 h-0.5 bg-[#0B1220] -translate-y-1/2 z-0 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />

            {steps.map((s) => {
              const isDone = s.id < currentStep;
              const isCurrent = s.id === currentStep;

              return (
                <div key={s.id} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isDone
                        ? 'bg-[#0B1220] text-white'
                        : isCurrent
                        ? 'bg-[#0B1220] text-white ring-4 ring-[#0B1220]/10'
                        : 'bg-white text-[#98A2B3] border-2 border-[#D0D5DD]'
                    }`}
                  >
                    {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : s.id}
                  </div>
                  <span
                    className={`text-[11px] font-semibold mt-2 hidden sm:block ${
                      isCurrent ? 'text-[#0B1220]' : isDone ? 'text-[#344054]' : 'text-[#98A2B3]'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 1: BUSINESS DETAILS */}
        {currentStep === 1 && (
          <div className="bg-white rounded-[14px] border border-[#E4E7EC] shadow-[0_4px_18px_rgba(11,18,32,0.04)] p-6 sm:p-10 max-w-2xl mx-auto animate-in fade-in duration-200">
            <div className="mb-6">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B1220] tracking-tight">
                Tell us about your business
              </h1>
              <p className="text-xs sm:text-sm text-[#667085] mt-1">
                These details appear on your invoice header and tell your clients who they're paying.
              </p>
            </div>

            <form onSubmit={handleSubmitStep1} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Business Name *"
                  placeholder="e.g. Adaeze Foods Ltd"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                />
                <Input
                  label="Owner / Contact Full Name *"
                  placeholder="e.g. Adaeze Nwosu"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Business Email"
                  type="email"
                  placeholder="hello@adaezefoods.ng"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  hint="Used for invoice delivery copies"
                />
                <Input
                  label="Business Phone Number"
                  placeholder="+234 803 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="pt-4 border-t border-[#F2F4F7] space-y-4">
                <div>
                  <h2 className="text-sm font-bold text-[#0B1220]">
                    Settlement Bank Account
                  </h2>
                  <p className="text-xs text-[#667085] mt-0.5">
                    Your account number will be prominently displayed on your invoice bank transfer block.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                </div>

                <Input
                  label="Account Holder Name"
                  placeholder="e.g. Adaeze Foods Ltd"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  hint="Ensure this matches the registered name on your bank account"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSaving}
                  rightIcon={<ArrowRight className="w-4 h-4 text-[#0B1220]" />}
                >
                  Continue
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: BRAND KIT & REAL-TIME PREVIEW */}
        {currentStep === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">
            {/* Left Column: Brand Controls */}
            <div className="lg:col-span-6 bg-white rounded-[14px] border border-[#E4E7EC] p-6 sm:p-8 shadow-[0_4px_18px_rgba(11,18,32,0.04)] space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B1220] tracking-tight">
                  Make it yours
                </h1>
                <p className="text-xs sm:text-sm text-[#667085] mt-1">
                  Your brand appears on every invoice you send.
                </p>
              </div>

              {/* Logo upload */}
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

              {/* Color pickers */}
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

              {/* Font Selection */}
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
                      className={`py-2.5 px-3 rounded-[8px] border text-xs font-semibold transition-all cursor-pointer ${
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

              {/* Template Picker with Wireframe Previews */}
              <div>
                <label className="text-xs font-semibold text-[#344054] block mb-2">
                  Default template
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(
                    [
                      { id: 'modern', label: 'Modern' },
                      { id: 'minimal', label: 'Minimal' },
                      { id: 'classic', label: 'Corporate' },
                    ] as const
                  ).map((tpl) => {
                    const isSelected = templateLayout === tpl.id;
                    return (
                      <div
                        key={tpl.id}
                        onClick={() => setTemplateLayout(tpl.id as TemplateLayout)}
                        className={`rounded-[10px] border p-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#0B1220] ring-2 ring-[#0B1220] bg-[#FAFAFA]'
                            : 'border-[#E4E7EC] hover:border-[#D0D5DD] bg-white'
                        }`}
                      >
                        {/* Wireframe thumbnail */}
                        <div className="h-16 bg-white border border-[#E4E7EC] rounded-[6px] p-1.5 flex flex-col justify-between mb-2 overflow-hidden">
                          {tpl.id === 'modern' && (
                            <>
                              <div className="h-2 bg-[#1E3A8A] rounded-xs w-full" />
                              <div className="space-y-1 my-auto">
                                <div className="h-1 bg-[#E4E7EC] rounded-xs w-2/3" />
                                <div className="h-1 bg-[#F2F4F7] rounded-xs w-1/2" />
                              </div>
                              <div className="h-1.5 bg-[#E4E7EC] rounded-xs w-full" />
                            </>
                          )}
                          {tpl.id === 'minimal' && (
                            <>
                              <div className="h-1 bg-[#344054] rounded-xs w-1/3" />
                              <div className="space-y-1 my-auto">
                                <div className="h-1 bg-[#E4E7EC] rounded-xs w-full" />
                                <div className="h-1 bg-[#F2F4F7] rounded-xs w-4/5" />
                              </div>
                              <div className="h-1 bg-[#344054] rounded-xs w-1/2 ml-auto" />
                            </>
                          )}
                          {tpl.id === 'classic' && (
                            <>
                              <div className="h-3 bg-[#0B1220] rounded-xs w-full flex items-center px-1">
                                <div className="h-1 bg-white/60 rounded-xs w-1/3" />
                              </div>
                              <div className="space-y-1 my-auto">
                                <div className="h-1 bg-[#E4E7EC] rounded-xs w-full" />
                                <div className="h-1 bg-[#F2F4F7] rounded-xs w-full" />
                              </div>
                              <div className="h-1.5 bg-[#F59E0B] rounded-xs w-full" />
                            </>
                          )}
                        </div>

                        <span className="text-xs font-semibold text-[#0B1220] block text-center">
                          {tpl.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="pt-4 flex items-center justify-between border-t border-[#F2F4F7]">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => goToStep(1)}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>

                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  isLoading={isSaving}
                  onClick={handleSubmitStep2}
                  rightIcon={<ArrowRight className="w-4 h-4 text-[#0B1220]" />}
                >
                  Continue
                </Button>
              </div>
            </div>

            {/* Right Column: Live Sheet Preview */}
            {renderLivePreview()}
          </div>
        )}

        {/* STEP 3: CAC VERIFICATION (SPLIT SCREEN) */}
        {currentStep === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">
            {/* Left Column: Verification Form */}
            <div className="lg:col-span-6 bg-white rounded-[14px] border border-[#E4E7EC] p-6 sm:p-8 shadow-[0_4px_18px_rgba(11,18,32,0.04)] space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B1220] tracking-tight">
                  Verify your business
                </h1>
                <p className="text-xs sm:text-sm text-[#667085] mt-1">
                  Verified invoices build trust. Buyers know exactly who they're paying.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-[#344054] block mb-2">
                    Business type
                  </label>
                  <RadioCard
                    name="cacType"
                    options={cacOptions}
                    selectedValue={cacType}
                    onChange={(val) => setCacType(val as CacType)}
                  />
                </div>

                <Input
                  label={cacType === 'BUSINESS_NAME' ? 'BN number' : 'RC number'}
                  placeholder={cacType === 'BUSINESS_NAME' ? '1234567' : '1234567'}
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  hint="Enter digits only or include RC/BN prefix"
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

                {/* Amber notice banner matching reference screenshot 8 */}
                <div className="p-3.5 rounded-[8px] bg-[#FEF6EE] border border-[#FECDCA] text-xs text-[#B54708] flex items-start gap-2.5">
                  <Clock className="w-4 h-4 shrink-0 text-[#B54708] mt-0.5" />
                  <p className="leading-relaxed">
                    We review your certificate within 24 hours. Until then, your invoices show <span className="font-bold">Unverified Merchant / Pending Review</span>.
                  </p>
                </div>

                {/* Navigation */}
                <div className="pt-4 flex items-center justify-between border-t border-[#F2F4F7]">
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={() => goToStep(2)}
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                  >
                    Back
                  </Button>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleSubmitStep3(true)}
                      className="text-xs font-semibold text-[#667085] hover:text-[#0B1220] transition-colors cursor-pointer"
                    >
                      Skip for now
                    </button>
                    <Button
                      type="button"
                      variant="primary"
                      size="md"
                      isLoading={isSaving}
                      onClick={() => handleSubmitStep3(false)}
                      rightIcon={<ArrowRight className="w-4 h-4 text-[#0B1220]" />}
                    >
                      Submit for review
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Live Sheet Preview */}
            {renderLivePreview()}
          </div>
        )}

        {/* STEP 4: VERIFICATION SUBMITTED / STATUS (SPLIT SCREEN) */}
        {currentStep === 4 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">
            {/* Left Column: Submitted Status */}
            <div className="lg:col-span-6 bg-white rounded-[14px] border border-[#E4E7EC] p-6 sm:p-8 shadow-[0_4px_18px_rgba(11,18,32,0.04)] space-y-6">
              {/* Header Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[6px] bg-[#FEF6EE] text-[#B54708] text-xs font-bold border border-[#FECDCA]">
                <Clock className="w-3.5 h-3.5" />
                <span>PENDING REVIEW</span>
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B1220] tracking-tight">
                  Verification submitted
                </h1>
                <p className="text-xs sm:text-sm text-[#667085] mt-1 leading-relaxed">
                  We're reviewing your CAC certificate. You'll be notified once approved.
                </p>
              </div>

              {/* Horizontal Stepper matching reference Screenshot 9 */}
              <div className="p-4 rounded-[10px] bg-[#FAFAFA] border border-[#E4E7EC]">
                <div className="flex items-center justify-between text-xs">
                  {/* Step 1: Submitted */}
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#0B1220] text-white flex items-center justify-center text-[10px] font-bold">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="font-bold text-[#0B1220]">Submitted</span>
                  </div>

                  <div className="flex-1 h-0.5 bg-[#0B1220] mx-3" />

                  {/* Step 2: In review */}
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#0B1220] text-white flex items-center justify-center text-[11px] font-bold">
                      2
                    </div>
                    <span className="font-bold text-[#0B1220]">In review</span>
                  </div>

                  <div className="flex-1 h-0.5 bg-[#E4E7EC] mx-3" />

                  {/* Step 3: Decision */}
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white border border-[#D0D5DD] text-[#98A2B3] flex items-center justify-center text-[11px] font-semibold">
                      3
                    </div>
                    <span className="text-[#98A2B3]">Decision</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  isLoading={isSaving}
                  onClick={handleComplete}
                  rightIcon={<ArrowRight className="w-4 h-4 text-[#0B1220]" />}
                >
                  Create your first invoice
                </Button>
              </div>
            </div>

            {/* Right Column: Live Sheet Preview */}
            {renderLivePreview()}
          </div>
        )}
      </div>
    </div>
  );
};
