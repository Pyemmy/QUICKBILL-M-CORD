import React from 'react';
import { TrendingUp, BarChart3, Clock, Bell, Sparkles } from 'lucide-react';
import { Button } from '../components/Button';
import { useToast } from '../components/Toast';

export const Insights: React.FC = () => {
  const { success } = useToast();

  return (
    <div className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-[#EEF2FF] text-[#4C7DFF] text-xs font-bold uppercase mb-1">
            <Sparkles className="w-3 h-3" />
            <span>Coming Soon</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B1220] tracking-tight">
            Revenue & Client Insights
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-0.5">
            Deep financial intelligence, payment aging trends, and customer collection velocity.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => success('Subscribed', "We'll notify you as soon as Insights launches!")}
          leftIcon={<Bell className="w-3.5 h-3.5" />}
        >
          Notify When Live
        </Button>
      </div>

      {/* Preview Teaser Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 opacity-75 pointer-events-none filter blur-[0.5px]">
        <div className="p-5 rounded-[12px] bg-white border border-[#E4E7EC] shadow-xs">
          <span className="text-xs font-semibold text-[#667085]">Monthly Volume</span>
          <p className="text-2xl font-extrabold text-[#0B1220] mt-1 tabular-nums">₦1,450,000</p>
          <span className="text-xs text-[#16A34A] font-semibold mt-1 inline-block">↑ 24% vs last month</span>
        </div>

        <div className="p-5 rounded-[12px] bg-white border border-[#E4E7EC] shadow-xs">
          <span className="text-xs font-semibold text-[#667085]">Average Collection Time</span>
          <p className="text-2xl font-extrabold text-[#0B1220] mt-1 tabular-nums">1.8 Days</p>
          <span className="text-xs text-[#16A34A] font-semibold mt-1 inline-block">⚡ 4x faster via WhatsApp</span>
        </div>

        <div className="p-5 rounded-[12px] bg-white border border-[#E4E7EC] shadow-xs">
          <span className="text-xs font-semibold text-[#667085]">Overdue Recovery Rate</span>
          <p className="text-2xl font-extrabold text-[#0B1220] mt-1 tabular-nums">94.2%</p>
          <span className="text-xs text-[#4C7DFF] font-semibold mt-1 inline-block">With CAC verification</span>
        </div>
      </div>

      {/* Center Coming Soon Box */}
      <div className="bg-white rounded-[14px] border border-dashed border-[#E4E7EC] p-8 sm:p-12 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-[#F2F4F7] text-[#4C7DFF] flex items-center justify-center mx-auto mb-2">
          <TrendingUp className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-[#0B1220]">
          Advanced Analytics in Active Development
        </h2>
        <p className="text-xs text-[#667085] max-w-md mx-auto leading-relaxed">
          We're building automated reconciliation with Nigerian bank accounts, bad-debt risk predictors, and recurring subscription invoicing.
        </p>
      </div>
    </div>
  );
};
