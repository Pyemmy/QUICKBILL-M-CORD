import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'underline' | 'pill';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'underline',
  className = '',
}) => {
  if (variant === 'pill') {
    return (
      <div className={`flex items-center gap-1.5 overflow-x-auto py-1 ${className}`}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              disabled={tab.disabled}
              onClick={() => onChange(tab.id)}
              className={`h-[36px] px-3.5 rounded-[8px] text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                isActive
                  ? 'bg-[#0B1220] text-white shadow-sm'
                  : 'bg-white border border-[#E4E7EC] text-[#344054] hover:bg-[#F9FAFB] hover:border-[#D0D5DD]'
              }`}
            >
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={`px-1.5 py-0.5 rounded-[4px] text-[11px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#F2F4F7] text-[#667085]'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Underline variant
  return (
    <div className={`flex items-center gap-6 border-b border-[#E4E7EC] ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            className={`pb-3 text-sm font-medium transition-all relative select-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              isActive
                ? 'text-[#0B1220] font-bold'
                : 'text-[#667085] hover:text-[#0B1220]'
            }`}
          >
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span className="ml-1.5 text-xs text-[#98A2B3]">({tab.count})</span>
            )}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0B1220]" />
            )}
          </button>
        );
      })}
    </div>
  );
};
