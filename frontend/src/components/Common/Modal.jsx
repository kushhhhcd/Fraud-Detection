import React, { useEffect } from 'react';

export function Modal({ isOpen, onClose, title, icon, children, maxWidth = 'max-w-lg' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className={`bg-[#0F172A] border border-[#2A3A54] rounded-lg w-full ${maxWidth} shadow-2xl overflow-hidden flex flex-col max-h-[90vh]`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#1E293B] bg-[#131D31] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            {icon && (
              <div className="w-8 h-8 rounded bg-[#0B111E] border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <span className="material-symbols-outlined text-lg">{icon}</span>
              </div>
            )}
            <h3 className="text-sm font-semibold text-white font-sans">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-[#1E293B] transition-colors"
            title="Close dialog"
            type="button"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
