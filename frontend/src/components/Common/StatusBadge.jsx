import React from 'react';

export function StatusBadge({ status, label, className = '' }) {
  const getStyles = () => {
    switch (status?.toLowerCase()) {
      case 'flagged':
      case 'critical':
      case 'fraud':
      case 'danger':
      case 'severe':
        return 'bg-red-950/70 border-red-800/60 text-red-400';
      case 'suspicious':
      case 'moderate':
      case 'warning':
      case 'review':
        return 'bg-amber-950/70 border-amber-800/60 text-amber-300';
      case 'approved':
      case 'stable':
      case 'normal':
      case 'active':
      case 'success':
      case 'met':
        return 'bg-emerald-950/70 border-emerald-800/60 text-emerald-400';
      case 'info':
      case 'cyan':
        return 'bg-cyan-950/70 border-cyan-800/60 text-cyan-300';
      case 'pending':
        return 'bg-purple-950/70 border-purple-800/60 text-purple-300';
      default:
        return 'bg-[#1E293B] border-[#2A3A54] text-slate-300';
    }
  };

  const getDotColor = () => {
    switch (status?.toLowerCase()) {
      case 'flagged':
      case 'critical':
      case 'fraud':
      case 'danger':
      case 'severe':
        return 'bg-red-500';
      case 'suspicious':
      case 'moderate':
      case 'warning':
      case 'review':
        return 'bg-amber-400';
      case 'approved':
      case 'stable':
      case 'normal':
      case 'active':
      case 'success':
      case 'met':
        return 'bg-emerald-400';
      case 'info':
      case 'cyan':
        return 'bg-cyan-400';
      case 'pending':
        return 'bg-purple-400';
      default:
        return 'bg-slate-400';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-sans font-medium border ${getStyles()} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${getDotColor()}`}></span>
      <span>{label || status}</span>
    </span>
  );
}

export default StatusBadge;
