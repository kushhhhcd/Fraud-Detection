import React from 'react';

export function MetricCard({
  title,
  value,
  badgeText,
  badgeVariant = 'default',
  icon,
  subtext,
  footerLabel,
  footerValue,
  hoverColor = 'hover:border-slate-700',
  children,
}) {
  const getBadgeStyle = () => {
    switch (badgeVariant) {
      case 'danger':
        return 'bg-red-950/70 border-red-800/60 text-red-400';
      case 'warning':
        return 'bg-amber-950/70 border-amber-800/60 text-amber-300';
      case 'success':
        return 'bg-emerald-950/60 border-emerald-800/60 text-emerald-400';
      case 'cyan':
        return 'bg-cyan-950/60 border-cyan-800/60 text-cyan-300';
      default:
        return 'bg-[#0B111E] border-[#1E293B] text-slate-400';
    }
  };

  return (
    <div
      className={`bg-[#131D31] border border-[#1E293B] rounded-lg p-4 flex flex-col justify-between transition-colors shadow-sm ${hoverColor}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400">{title}</span>
        {icon && (
          <span className="material-symbols-outlined text-slate-500 text-base">
            {icon}
          </span>
        )}
        {badgeText && (
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded font-sans border ${getBadgeStyle()}`}
          >
            {badgeText}
          </span>
        )}
      </div>

      <div className="my-2 flex items-baseline justify-between">
        <span className="text-2xl font-bold font-sans text-slate-100 tracking-tight">
          {value}
        </span>
        {subtext && (
          <span className="text-xs text-slate-400 font-sans">{subtext}</span>
        )}
      </div>

      {children}

      {(footerLabel || footerValue) && (
        <div className="flex items-center justify-between border-t border-[#1E293B] pt-2 text-xs font-sans text-slate-400 mt-1">
          <span>{footerLabel}</span>
          <span className="text-slate-300 font-mono">{footerValue}</span>
        </div>
      )}
    </div>
  );
}

export default MetricCard;
