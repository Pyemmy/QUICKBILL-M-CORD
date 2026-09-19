import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  Share2,
  ArrowRight,
  CheckCircle2,
  Lock,
  Zap,
  Building2,
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';
import { InvoiceTemplate } from '../components/InvoiceTemplate';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-[#0B1220] flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="h-20 border-b border-[#E4E7EC] px-4 sm:px-12 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-30">
        <Logo size="md" showTagline={true} />

        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#344054]">
          <a href="#features" className="hover:text-[#0B1220] transition-colors">
            Features
          </a>
          <a href="#trust" className="hover:text-[#0B1220] transition-colors">
            CAC Verification
          </a>
          <a href="#templates" className="hover:text-[#0B1220] transition-colors">
            Templates
          </a>
          <Link to="/help" className="hover:text-[#0B1220] transition-colors">
            FAQ
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </Link>
          <Link to="/app">
            <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5 text-[#0B1220]" />}>
              Open Composer
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 sm:px-12 pt-16 pb-20 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & CTA */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E6FAF4] text-[#0B1220] text-xs font-bold border border-[#27D6A3]/40">
              <Sparkles className="w-3.5 h-3.5 text-[#20C494]" />
              <span>AI-POWERED INVOICING ENGINE FOR AFRICAN SMES</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-[#0B1220]">
              Invoice. Verify. <br />
              <span className="text-[#20C494]">Get Paid Faster.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#667085] leading-relaxed max-w-xl">
              Type an invoice request in plain English or Nigerian Pidgin. We extract items, rates, and due dates into professional, CAC-authenticated invoices ready for WhatsApp and bank transfers.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/app')}
                rightIcon={<ArrowRight className="w-4 h-4 text-[#0B1220]" />}
              >
                Create Invoice Now (Free)
              </Button>

              <Link to="/i/qb_okafor_778899" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  View Live Public Demo
                </Button>
              </Link>
            </div>

            <div className="pt-4 flex items-center gap-6 text-xs text-[#667085]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                <span>No Credit Card Needed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
                <span>CAC Registry Verification</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Invoice Card Preview */}
          <div className="lg:col-span-6 relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#27D6A3]/10 to-[#4C7DFF]/10 rounded-[20px] blur-xl -z-10" />
            <div className="transform transition-transform hover:scale-[1.01] duration-300">
              <InvoiceTemplate
                template="modern"
                businessName="Adaeze Foods Ltd"
                primaryColor="#1E3A8A"
                secondaryColor="#F59E0B"
                fontFamily="Inter"
                verificationStatus="VERIFIED"
                registrationNumber="1234567"
                invoiceNumber="INV-007"
                issueDate="2026-09-19"
                dueDate="2026-09-21"
                clientName="Chief Okafor"
                bankName="Guaranty Trust Bank (GTBank)"
                accountNumber="0123456789"
                accountName="Adaeze Foods Ltd"
                lineItems={[
                  { description: 'Bag of premium rice', quantity: 3, unitPrice: 15000, total: 45000 },
                  { description: 'Dispatch delivery fee', quantity: 1, unitPrice: 5000, total: 5000 },
                ]}
                subtotal={50000}
                taxAmount={0}
                totalAmount={50000}
                isCompactPreview={true}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-20 bg-[#FAFAFA] border-t border-[#E4E7EC] px-4 sm:px-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0B1220]">
              Engineered Specifically for Nigerian Commerce
            </h2>
            <p className="text-sm text-[#667085]">
              Say goodbye to messy spreadsheets, slow manual calculators, and unverified invoice screenshots.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-[12px] border border-[#E4E7EC] shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-[8px] bg-[#EEF2FF] text-[#4C7DFF] flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0B1220]">
                Natural Language AI Composer
              </h3>
              <p className="text-xs text-[#667085] leading-relaxed">
                Type: "Bill Mama Nkechi for 20 crates of eggs at 4,500 each and 8k delivery due next Friday." The model structures items and does strict math recalculation.
              </p>
            </div>

            <div className="bg-white p-8 rounded-[12px] border border-[#E4E7EC] shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-[8px] bg-[#E8F8EE] text-[#16A34A] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0B1220]">
                CAC Verified Trust Badge
              </h3>
              <p className="text-xs text-[#667085] leading-relaxed">
                Prove authenticity to corporate and high-value clients. Verified merchants display an official CAC badge with authenticated RC/BN registry popover.
              </p>
            </div>

            <div className="bg-white p-8 rounded-[12px] border border-[#E4E7EC] shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-[8px] bg-[#E6FAF4] text-[#20C494] flex items-center justify-center">
                <Share2 className="w-6 h-6 text-[#0B1220]" />
              </div>
              <h3 className="text-lg font-bold text-[#0B1220]">
                1-Click WhatsApp & Bank Copy
              </h3>
              <p className="text-xs text-[#667085] leading-relaxed">
                Generates a pre-filled professional WhatsApp message and a clean bank transfer block with instant 10-digit NUBAN copy for friction-free payment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#E4E7EC] bg-white py-12 px-4 sm:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo size="sm" showTagline={true} />
          <div className="flex items-center gap-6 text-xs text-[#667085]">
            <Link to="/app" className="hover:text-[#0B1220]">
              AI Composer
            </Link>
            <Link to="/app/invoices" className="hover:text-[#0B1220]">
              Invoices
            </Link>
            <Link to="/app/settings" className="hover:text-[#0B1220]">
              Settings
            </Link>
            <Link to="/help" className="hover:text-[#0B1220]">
              Help & FAQ
            </Link>
          </div>
          <div className="text-xs text-[#98A2B3]">
            © 2026 QUICKBILL. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
