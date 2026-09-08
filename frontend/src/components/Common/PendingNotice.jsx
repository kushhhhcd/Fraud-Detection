import React from 'react';

export function PendingNotice({
  feature,
  endpoint,
  sourceFile,
  description,
  className = '',
}) {
  return (
    <div
      className={`p-3 rounded-lg bg-[#0F172A] border border-cyan-500/30 text-xs shadow-sm ${className}`}
    >
      <div className="flex items-start gap-2.5">
        <span className="material-symbols-outlined text-cyan-400 text-lg shrink-0 mt-0.5">
          pending_actions
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-semibold text-white">{feature}</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-medium">
              Pending ML/Backend Integration
            </span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {description || 'This feature awaits backend and ML pipeline completion. Live data will be populated once the endpoint is connected.'}
          </p>
          {(endpoint || sourceFile) && (
            <div className="mt-2 pt-2 border-t border-[#1E293B] flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400">
              {endpoint && (
                <span>
                  Target API: <code className="text-cyan-300">{endpoint}</code>
                </span>
              )}
              {sourceFile && (
                <span>
                  Implementation File: <code className="text-slate-200">{sourceFile}</code>
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PendingNotice;
