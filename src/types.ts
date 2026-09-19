export type CacType = 'BUSINESS_NAME' | 'LIMITED_COMPANY' | 'INCORPORATED_TRUSTEE';
export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';
export type TemplateLayout = 'modern' | 'classic' | 'minimal';
export type FontFamily = 'Inter' | 'Roboto' | 'Montserrat';
export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE';

export interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface BusinessProfile {
  id: string;
  ownerUid: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  cacType: CacType;
  registrationNumber: string;
  cacDocumentUrl?: string;
  cacFileName?: string;
  verificationStatus: VerificationStatus;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: FontFamily;
  templateLayout: TemplateLayout;
  bankName: string;
  accountNumber: string;
  accountName: string;
  onboardingStep: number;
  onboardingComplete: boolean;
  cacSubmittedAt?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  ownerUid: string;
  businessId: string;
  invoiceNumber: string;
  publicId: string;
  clientName: string;
  clientEmail?: string | null;
  clientPhone?: string | null;
  lineItems: LineItem[];
  currency: 'NGN';
  subtotal: number;
  taxRate?: number | null;
  taxAmount: number;
  totalAmount: number;
  issueDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  status: InvoiceStatus;
  rawPrompt?: string;
  warnings?: string[];
  sentAt?: string | null;
  paidAt?: string | null;
  createdAt: string;
  updatedAt: string;
  daysOverdue?: number;
}

export interface PublicInvoiceResponse {
  invoice: {
    invoiceNumber: string;
    publicId: string;
    clientName: string;
    lineItems: LineItem[];
    currency: 'NGN';
    subtotal: number;
    taxRate?: number | null;
    taxAmount: number;
    totalAmount: number;
    issueDate: string;
    dueDate: string;
    status: InvoiceStatus;
    daysOverdue?: number;
    paidAt?: string | null;
  };
  merchant: {
    businessName: string;
    email: string;
    phone: string;
    logoUrl?: string;
    primaryColor: string;
    secondaryColor: string;
    fontFamily: FontFamily;
    templateLayout: TemplateLayout;
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  verification: {
    status: VerificationStatus;
    registrationNumber?: string;
    cacType?: CacType;
    reviewedAt?: string;
  };
}

export interface ParsePromptResult {
  invoice: {
    clientName: string;
    clientEmail?: string | null;
    clientPhone?: string | null;
    lineItems: LineItem[];
    currency: 'NGN';
    subtotal: number;
    taxRate?: number | null;
    taxAmount: number;
    totalAmount: number;
    issueDate: string;
    dueDate: string;
  };
  warnings: string[];
}

export interface UserAccount {
  uid: string;
  email: string;
  fullName: string;
  phone: string;
  isAdmin: boolean;
  createdAt: string;
}

export type ParsePromptResponse = ParsePromptResult;
export type PublicInvoiceData = PublicInvoiceResponse;

export interface CreateInvoicePayload {
  clientName: string;
  clientEmail?: string | null;
  clientPhone?: string | null;
  lineItems: LineItem[];
  currency?: 'NGN';
  taxRate?: number | null;
  taxAmount?: number;
  issueDate: string;
  dueDate: string;
  rawPrompt?: string;
  warnings?: string[];
}

export interface PendingVerificationItem {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  cacType: CacType;
  registrationNumber: string;
  cacDocumentUrl?: string;
  cacFileName?: string;
  cacSubmittedAt: string;
}
