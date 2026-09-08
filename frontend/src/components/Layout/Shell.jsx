import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Modal from '../Common/Modal';
import PendingNotice from '../Common/PendingNotice';
import { useAuth } from '../../context/AuthContext';

export function Shell({ currentTab, onSelectTab, pageTitle, children, onRefreshData }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRetrainModalOpen, setIsRetrainModalOpen] = useState(false);
  const { logout, isAdmin } = useAuth();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0B111E] text-[#F8FAFC]">
      {/* Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={onSelectTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#0B111E]">
        <Header
          pageTitle={pageTitle}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onTriggerRetrain={() => setIsRetrainModalOpen(true)}
          onRefresh={onRefreshData}
          onNavigateAlerts={() => onSelectTab('alerts')}
          onLogout={logout}
        />

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#0B111E]">
          <div className="max-w-[1440px] mx-auto">{children}</div>
        </main>
      </div>

      {/* Retrain Pipeline Modal */}
      <Modal
        isOpen={isRetrainModalOpen}
        onClose={() => setIsRetrainModalOpen(false)}
        title="Model Retraining Pipeline Status"
        icon="restart_alt"
        maxWidth="max-w-xl"
      >
        <div className="space-y-4">
          <PendingNotice
            feature="Automated Model Retraining Pipeline"
            endpoint="POST /models/retrain"
            sourceFile="ml/train.py"
            description="The ML training script (ml/train.py) and retraining endpoint are pending backend implementation. In accordance with project instructions, automated retraining execution is disabled until the backend API is connected."
          />

          <div className="bg-[#131D31] border border-[#1E293B] rounded divide-y divide-[#1E293B] text-xs font-sans">
            <div className="px-3.5 py-2.5 flex justify-between items-center">
              <span className="text-slate-400 font-medium">Target Model:</span>
              <span className="font-mono text-white font-semibold flex items-center gap-1.5">
                <span className="text-slate-300">Random Forest Classifier</span>
                <span className="text-cyan-400">(SMOTE Balanced)</span>
              </span>
            </div>
            <div className="px-3.5 py-2.5 flex justify-between items-center">
              <span className="text-slate-400 font-medium">Balancing Method:</span>
              <span className="text-cyan-300 font-mono text-xs">SMOTE (Over-sampling)</span>
            </div>
            <div className="px-3.5 py-2.5 flex justify-between items-center">
              <span className="text-slate-400 font-medium">Target Validation Metrics:</span>
              <span className="text-emerald-400 font-mono font-medium">
                Precision &gt;= 90%, Recall &gt;= 88%
              </span>
            </div>
            <div className="px-3.5 py-2.5 flex justify-between items-center">
              <span className="text-slate-400 font-medium">Execution Status:</span>
              <span className="px-2 py-0.5 rounded bg-amber-950/70 border border-amber-600/50 text-amber-300 font-mono font-medium">
                Retraining API Pending
              </span>
            </div>
            <div className="px-3.5 py-2.5 flex justify-between items-center">
              <span className="text-slate-400 font-medium">Required Role:</span>
              <span className="font-mono text-slate-300">
                {isAdmin ? (
                  <span className="text-emerald-400 font-bold">Admin</span>
                ) : (
                  <span className="text-slate-400">Analyst (View Only)</span>
                )}
              </span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#1E293B]">
            <button
              onClick={() => setIsRetrainModalOpen(false)}
              className="h-8 px-4 bg-[#131D31] border border-[#1E293B] text-slate-300 hover:text-white text-xs font-medium rounded transition-colors"
              type="button"
            >
              Close
            </button>
            <button
              disabled
              className="h-8 px-4 font-semibold text-xs rounded bg-[#1E293B] text-slate-500 cursor-not-allowed border border-slate-700 flex items-center gap-1.5"
              type="button"
              title="Execution disabled until backend endpoint POST /models/retrain is implemented"
            >
              <span className="material-symbols-outlined text-sm">block</span>
              <span>Retraining API Pending</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Shell;
