import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  PenSquare,
  FileText,
  Building2,
  TrendingUp,
  HelpCircle,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Sparkles,
  Layers,
  X,
  ExternalLink,
  ShieldAlert,
  Plus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Logo } from './Logo';
import { StatusChip } from './StatusChip';

export const AppLayout: React.FC = () => {
  const { user, business, logout, switchPersona } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showReviewDrawer, setShowReviewDrawer] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    {
      to: '/app/invoices',
      label: 'Invoices',
      icon: <FileText className="w-4 h-4 text-[#667085]" />,
    },
    {
      to: '/app/settings',
      label: 'Brand & business',
      icon: <Building2 className="w-4 h-4 text-[#667085]" />,
    },
    {
      to: '/app/insights',
      label: 'Insights',
      icon: <TrendingUp className="w-4 h-4 text-[#98A2B3]" />,
      badge: 'Soon',
    },
  ];

  const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || 'owoadeopeyemi11@gmail.com,admin@quickbill.ng')
    .toLowerCase();
  const isAdmin = user?.isAdmin || (user?.email && adminEmails.includes(user.email.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col md:flex-row text-[#0B1220]">
      {/* DESKTOP SIDEBAR (256px wide) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-[#E4E7EC] shrink-0 h-screen sticky top-0 z-30">
        {/* Top Logo */}
        <div className="p-6 pb-4 border-b border-[#F2F4F7]">
          <NavLink to="/app" className="inline-block">
            <Logo size="md" showTagline={true} />
          </NavLink>
        </div>

        {/* Primary Navigation */}
        <nav className="flex-1 px-3.5 py-4 space-y-1.5 overflow-y-auto">
          {/* Top prominent + Create invoice button */}
          <button
            type="button"
            onClick={() => navigate('/app')}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-[8px] bg-[#0B1220] text-white text-sm font-semibold hover:bg-[#1E293B] shadow-xs cursor-pointer mb-3 transition-colors"
          >
            <Plus className="w-4 h-4 text-[#27D6A3]" />
            <span>Create invoice</span>
          </button>

          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.to);

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex items-center justify-between px-3 py-2.5 rounded-[8px] text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#0B1220] text-white shadow-xs'
                    : 'text-[#344054] hover:bg-[#F2F4F7] hover:text-[#0B1220]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-[#27D6A3]' : ''}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded-[4px] text-[10px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#F2F4F7] text-[#667085]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          {/* Admin Queue Link (if admin) */}
          {isAdmin && (
            <NavLink
              to="/admin/verifications"
              className={`flex items-center justify-between px-3 py-2.5 rounded-[8px] text-sm font-semibold transition-all mt-4 border border-[#4C7DFF]/20 ${
                location.pathname.startsWith('/admin')
                  ? 'bg-[#4C7DFF] text-white'
                  : 'bg-[#EEF2FF] text-[#4C7DFF] hover:bg-[#E0EAFF]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Admin CAC Queue</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#4C7DFF] animate-ping" />
            </NavLink>
          )}

          {/* SUPPORT section heading matching reference */}
          <div className="pt-4 pb-1">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#98A2B3] block">
              SUPPORT
            </span>
          </div>

          {/* Help link */}
          <NavLink
            to="/help"
            className="flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-sm font-medium text-[#667085] hover:bg-[#F2F4F7] hover:text-[#0B1220] transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-[#98A2B3]" />
            <span>Help</span>
          </NavLink>
        </nav>

        {/* Bottom Business Card & Verification Status */}
        <div className="p-3.5 border-t border-[#E4E7EC] bg-[#FAFAFA]">
          <div
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center justify-between p-2 rounded-[8px] hover:bg-white transition-all cursor-pointer border border-transparent hover:border-[#E4E7EC]"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-[8px] bg-[#0B1220] text-white font-bold flex items-center justify-center text-xs shrink-0 border border-white/20">
                {business?.businessName?.slice(0, 2).toUpperCase() || 'QB'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#0B1220] truncate">
                  {business?.businessName || 'My Business'}
                </p>
                <div className="mt-0.5">
                  <StatusChip
                    status={business?.verificationStatus || 'PENDING'}
                    size="sm"
                  />
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#98A2B3] shrink-0" />
          </div>

          {/* User Popover menu */}
          {showUserMenu && (
            <div className="mt-2 p-2 bg-white rounded-[8px] border border-[#E4E7EC] shadow-md space-y-1 text-xs">
              <div className="px-2 py-1 text-[#667085] border-b border-[#F2F4F7]">
                Signed in as <span className="font-semibold text-[#0B1220]">{user?.email}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigate('/app/settings');
                  setShowUserMenu(false);
                }}
                className="w-full text-left px-2 py-1.5 rounded-[4px] hover:bg-[#F2F4F7] font-medium text-[#344054]"
              >
                Settings & Verification
              </button>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setShowUserMenu(false);
                }}
                className="w-full text-left px-2 py-1.5 rounded-[4px] hover:bg-[#FEF3F2] font-medium text-[#DC3E3E] flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* MOBILE TOP BAR */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-[#E4E7EC] sticky top-0 z-30">
        <NavLink to="/app">
          <Logo size="sm" />
        </NavLink>
        <div className="flex items-center gap-2">
          <StatusChip
            status={business?.verificationStatus || 'PENDING'}
            size="sm"
          />
          <button
            type="button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-8 h-8 rounded-full bg-[#0B1220] text-white text-xs font-bold flex items-center justify-center"
          >
            {business?.businessName?.slice(0, 1).toUpperCase() || 'Q'}
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0 pb-20 md:pb-8 flex flex-col">
        <Outlet />
      </main>

      {/* MOBILE BOTTOM NAVIGATION (Create, Invoices, Business) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[#E4E7EC] flex items-center justify-around px-2 z-40 shadow-lg">
        <NavLink
          to="/app"
          end
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[11px] font-semibold transition-colors ${
              isActive ? 'text-[#0B1220]' : 'text-[#98A2B3]'
            }`
          }
        >
          <div className="p-1 rounded-[6px]">
            <Sparkles className="w-5 h-5 text-[#4C7DFF]" />
          </div>
          <span>Create</span>
        </NavLink>

        <NavLink
          to="/app/invoices"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[11px] font-semibold transition-colors ${
              isActive ? 'text-[#0B1220]' : 'text-[#98A2B3]'
            }`
          }
        >
          <div className="p-1 rounded-[6px]">
            <FileText className="w-5 h-5" />
          </div>
          <span>Invoices</span>
        </NavLink>

        <NavLink
          to="/app/settings"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[11px] font-semibold transition-colors ${
              isActive ? 'text-[#0B1220]' : 'text-[#98A2B3]'
            }`
          }
        >
          <div className="p-1 rounded-[6px]">
            <Building2 className="w-5 h-5" />
          </div>
          <span>Business</span>
        </NavLink>
      </nav>

      {/* FLOATING DESIGN REVIEW & PERSONA DRAWER (Bottom Left, matching reference screenshots) */}
      <div className="fixed bottom-4 left-4 z-50 hidden lg:block">
        {!showReviewDrawer ? (
          <button
            type="button"
            onClick={() => setShowReviewDrawer(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0B1220] text-white text-xs font-semibold shadow-lg hover:bg-[#152238] transition-all border border-white/20"
          >
            <Layers className="w-3.5 h-3.5 text-[#27D6A3]" />
            <span>DESIGN REVIEW (18 / 18 screens)</span>
          </button>
        ) : (
          <div className="bg-[#0B1220] text-white rounded-[12px] p-4 shadow-2xl border border-white/20 w-80 text-xs animate-in slide-in-from-bottom-3 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2 font-bold text-[#27D6A3]">
                <Layers className="w-4 h-4" />
                <span>QUICKBILL Design Reference</span>
              </div>
              <button
                type="button"
                onClick={() => setShowReviewDrawer(false)}
                className="text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Persona Switcher */}
            <div className="mb-3">
              <span className="text-[10px] uppercase font-bold text-white/50 block mb-1.5">
                Active Demo Persona
              </span>
              <div className="grid grid-cols-3 gap-1">
                <button
                  type="button"
                  onClick={() => switchPersona('adaeze')}
                  className={`py-1 px-1.5 rounded-[4px] text-[11px] font-semibold text-center truncate ${
                    business?.businessName?.includes('Adaeze')
                      ? 'bg-[#27D6A3] text-[#0B1220]'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  Adaeze (Verified)
                </button>
                <button
                  type="button"
                  onClick={() => switchPersona('new_merchant')}
                  className="py-1 px-1.5 rounded-[4px] text-[11px] font-semibold text-center bg-white/10 text-white hover:bg-white/20 truncate"
                >
                  New Merchant
                </button>
                <button
                  type="button"
                  onClick={() => switchPersona('admin')}
                  className="py-1 px-1.5 rounded-[4px] text-[11px] font-semibold text-center bg-white/10 text-white hover:bg-white/20 truncate"
                >
                  Admin
                </button>
              </div>
            </div>

            {/* Quick Screen Jump links */}
            <div>
              <span className="text-[10px] uppercase font-bold text-white/50 block mb-1.5">
                Quick Screen Navigator
              </span>
              <div className="grid grid-cols-2 gap-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="text-left px-2 py-1 rounded bg-white/5 hover:bg-white/15 text-white/80"
                >
                  Landing Page
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-left px-2 py-1 rounded bg-white/5 hover:bg-white/15 text-white/80"
                >
                  Login / Sign Up
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/onboarding')}
                  className="text-left px-2 py-1 rounded bg-white/5 hover:bg-white/15 text-white/80"
                >
                  Onboarding Flow
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/app')}
                  className="text-left px-2 py-1 rounded bg-white/5 hover:bg-white/15 text-white/80"
                >
                  AI Composer
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/app/invoices')}
                  className="text-left px-2 py-1 rounded bg-white/5 hover:bg-white/15 text-white/80"
                >
                  Invoices List
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/app/settings')}
                  className="text-left px-2 py-1 rounded bg-white/5 hover:bg-white/15 text-white/80"
                >
                  Settings & Brand
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/i/qb_okafor_778899')}
                  className="text-left px-2 py-1 rounded bg-white/5 hover:bg-white/15 text-white/80"
                >
                  Public: Okafor (Sent)
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/i/qb_bello_334455')}
                  className="text-left px-2 py-1 rounded bg-white/5 hover:bg-white/15 text-white/80"
                >
                  Public: Bello (Overdue)
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/i/qb_amaka_445566')}
                  className="text-left px-2 py-1 rounded bg-white/5 hover:bg-white/15 text-white/80"
                >
                  Public: Amaka (Paid)
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/admin/verifications')}
                  className="text-left px-2 py-1 rounded bg-[#4C7DFF]/30 hover:bg-[#4C7DFF]/50 text-white font-semibold"
                >
                  Admin CAC Queue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
