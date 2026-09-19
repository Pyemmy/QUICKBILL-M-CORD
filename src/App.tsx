/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import { AppLayout } from './components/AppLayout';

// Pages
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { Onboarding } from './pages/Onboarding';
import { Composer } from './pages/Composer';
import { ReviewInvoice } from './pages/ReviewInvoice';
import { InvoicesList } from './pages/InvoicesList';
import { Settings } from './pages/Settings';
import { AdminVerifications } from './pages/AdminVerifications';
import { PublicInvoice } from './pages/PublicInvoice';
import { Insights } from './pages/Insights';
import { Help } from './pages/Help';

// Protected Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] text-sm text-[#667085]">
        Loading QUICKBILL session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Admin Guard
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] text-sm text-[#667085]">
        Verifying administrator privileges...
      </div>
    );
  }

  const isAdmin =
    user?.email === 'owoadeopeyemi11@gmail.com' ||
    user?.email === 'admin@quickbill.ng' ||
    user?.email?.includes('admin');

  if (!isAdmin) {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public Landing & Marketing */}
            <Route path="/" element={<Landing />} />

            {/* Public Invoice (Edge-to-edge / unauthenticated) */}
            <Route path="/i/:publicId" element={<PublicInvoice />} />

            {/* Authentication */}
            <Route path="/login" element={<Auth />} />
            <Route path="/signup" element={<Auth />} />

            {/* Onboarding Flow (Resumable, 4 steps) */}
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              }
            />

            {/* Core Merchant App (Wrapped in AppLayout) */}
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Composer />} />
              <Route path="invoices" element={<InvoicesList />} />
              <Route path="invoices/:id/review" element={<ReviewInvoice />} />
              <Route path="settings" element={<Settings />} />
              <Route path="insights" element={<Insights />} />
              <Route path="help" element={<Help />} />
            </Route>

            {/* Admin Desk */}
            <Route
              path="/admin/verifications"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <AppLayout />
                  </AdminRoute>
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminVerifications />} />
            </Route>

            {/* Help & Fallback */}
            <Route path="/help" element={<Help />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
