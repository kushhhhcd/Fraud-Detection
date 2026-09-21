import React from 'react';
import { useAuth } from '../../context/AuthContext';

export function Header({
  pageTitle,
  onOpenSidebar,
  onTriggerRetrain,
  onRefresh,
  onNavigateAlerts,
  onLogout,
}) {
  const { user } = useAuth();

  return (
    <header className="h-[56px] min-h-[56px] w-full bg-[#0D1320] border-b border-[#1E293B] px-4 md:px-6 flex items-center justify-between z-30 shrink-0">
      {/* Left: Hamburger & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden text-slate-400 hover:text-white p-1 rounded hover:bg-[#131D31]"
          type="button"
          title="Open Navigation"
        >
          <span className="material-symbols-outlined text-xl">menu</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs md:text-sm font-semibold text-cyan-400 font-sans hidden sm:inline-block">
            Fraud Detection & Drift
          </span>
          <span className="text-slate-600 text-xs hidden sm:inline-block">/</span>
          <h1 className="text-xs md:text-sm font-medium text-slate-100 tracking-normal truncate max-w-[160px] sm:max-w-none">
            {pageTitle}
          </h1>
        </div>

        {/* Model Badge */}
        <div className="hidden xl:flex items-center gap-2 pl-3 border-l border-[#1E293B]">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-sans bg-cyan-950/40 border border-cyan-800/50 text-cyan-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            {user?.modelName || 'Random Forest (v1.0)'}
          </span>
        </div>
      </div>

      {/* Right: Retrain CTA & Profile Tools */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Trigger Retrain Action */}
        <button
          onClick={onTriggerRetrain}
          type="button"
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold transition-colors h-8 px-3 rounded-md text-xs flex items-center gap-1.5 shadow-sm shadow-cyan-500/20"
        >
          <span className="material-symbols-outlined text-sm font-bold">bolt</span>
          <span className="hidden sm:inline">Trigger Retrain</span>
        </button>

        <div className="h-4 w-px bg-[#1E293B] mx-0.5 hidden sm:block"></div>

        {/* Refresh API Data */}
        <button
          onClick={onRefresh}
          className="w-8 h-8 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-200 hover:bg-[#131D31] transition-colors"
          title="Refresh Data from API"
          type="button"
        >
          <span className="material-symbols-outlined text-[19px]">sync</span>
        </button>

        {/* Alerts Bell */}
        <button
          onClick={onNavigateAlerts}
          className="relative w-8 h-8 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-200 hover:bg-[#131D31] transition-colors"
          title="Alerts Feed"
          type="button"
        >
          <span className="material-symbols-outlined text-[19px]">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#0D1320]"></span>
        </button>

        <div className="h-4 w-px bg-[#1E293B] mx-0.5"></div>

        {/* Logout button */}
        <button
          onClick={onLogout}
          className="text-slate-400 hover:text-red-400 p-1 rounded hover:bg-[#131D31] transition-colors"
          title="Sign Out"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
