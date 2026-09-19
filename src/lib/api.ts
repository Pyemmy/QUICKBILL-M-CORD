import {
  BusinessProfile,
  Invoice,
  CreateInvoicePayload,
  ParsePromptResponse,
  PublicInvoiceData,
  PendingVerificationItem,
} from '../types';

const TOKEN_KEY = 'quickbill_token';
const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

function apiUrl(endpoint: string): string {
  return `${API_BASE_URL}${endpoint}`;
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(apiUrl(endpoint), {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorMsg = 'An unexpected error occurred';
    try {
      const json = await res.json();
      errorMsg = json.error || errorMsg;
    } catch {
      errorMsg = `Server error (${res.status})`;
    }
    throw new Error(errorMsg);
  }

  return res.json();
}

export const api = {
  // Auth
  async login(email: string, password = 'password123') {
    const data = await request<{ token: string; user: any; business: BusinessProfile }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setStoredToken(data.token);
    return data;
  },

  async register(email: string, fullName: string, password = 'password123', phone?: string) {
    const data = await request<{ token: string; user: any; business: BusinessProfile }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, fullName, password, phone }),
    });
    setStoredToken(data.token);
    return data;
  },

  async getMe() {
    return request<{ user: any; business: BusinessProfile }>('/api/auth/me');
  },

  async logout() {
    try {
      await request('/api/auth/logout', { method: 'POST' });
    } finally {
      clearStoredToken();
    }
  },

  // Business Profile
  async getProfile(): Promise<BusinessProfile> {
    return request<BusinessProfile>('/api/business/profile');
  },

  async updateProfile(updates: Partial<BusinessProfile>): Promise<BusinessProfile> {
    return request<BusinessProfile>('/api/business/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async submitCac(cacData: {
    cacType: string;
    registrationNumber: string;
    cacDocumentUrl?: string;
    cacFileName?: string;
  }): Promise<BusinessProfile> {
    return request<BusinessProfile>('/api/business/cac', {
      method: 'POST',
      body: JSON.stringify(cacData),
    });
  },

  // AI Prompt Parsing
  async parsePrompt(prompt: string): Promise<ParsePromptResponse> {
    return request<ParsePromptResponse>('/api/parse-prompt', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
  },

  // Invoices
  async createInvoice(payload: CreateInvoicePayload): Promise<Invoice> {
    return request<Invoice>('/api/invoice/create', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getInvoices(): Promise<Invoice[]> {
    return request<Invoice[]>('/api/invoices');
  },

  async getInvoice(id: string): Promise<Invoice> {
    return request<Invoice>(`/api/invoices/${id}`);
  },

  async updateInvoice(id: string, updates: Partial<Invoice>): Promise<Invoice> {
    return request<Invoice>(`/api/invoices/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  async deleteInvoice(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/api/invoices/${id}`, {
      method: 'DELETE',
    });
  },

  // Public Invoice (Unauthenticated)
  async getPublicInvoice(publicId: string): Promise<PublicInvoiceData> {
    const res = await fetch(apiUrl(`/api/public/invoices/${publicId}`));
    if (!res.ok) {
      let errorMsg = 'Invoice not found';
      try {
        const json = await res.json();
        errorMsg = json.error || errorMsg;
      } catch {
        // use default
      }
      throw new Error(errorMsg);
    }
    return res.json();
  },

  // Admin Queue
  async getAdminVerifications(): Promise<PendingVerificationItem[]> {
    return request<PendingVerificationItem[]>('/api/admin/verifications');
  },

  async submitAdminDecision(
    businessId: string,
    decision: 'approve' | 'reject',
    rejectionReason?: string
  ): Promise<{ success: boolean; business: BusinessProfile }> {
    return request<{ success: boolean; business: BusinessProfile }>(
      `/api/admin/verifications/${businessId}/decision`,
      {
        method: 'POST',
        body: JSON.stringify({ decision, rejectionReason }),
      }
    );
  },

  // Demo Tool
  async seedDemoInvoices(): Promise<{ count: number; invoices: Invoice[] }> {
    return request<{ count: number; invoices: Invoice[] }>('/api/admin/seed-demo', {
      method: 'POST',
    });
  },
};
