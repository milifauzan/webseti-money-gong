import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div id="toast-notification-container" className="fixed bottom-20 sm:bottom-5 right-3 sm:right-5 z-50 flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          id={`toast-${toast.id}`}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-xl border text-xs sm:text-sm transition-all duration-300 transform translate-y-0 ${
            toast.type === 'success'
              ? 'bg-[#e4efe8] border-[#bed8c7] text-[#1b4332]'
              : toast.type === 'error'
              ? 'bg-[#faecec] border-[#ecd3d3] text-[#8a3333]'
              : 'bg-[#f7f5ed] border-[#ded7c5] text-[#1b2b20]'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#1b4332] shrink-0 mt-0.5" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-[#8a3333] shrink-0 mt-0.5" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-[#2d6a4f] shrink-0 mt-0.5" />}

          <div className="flex-1 font-semibold">{toast.message}</div>

          <button
            type="button"
            id={`btn-dismiss-toast-${toast.id}`}
            onClick={() => onDismiss(toast.id)}
            className="text-[#52796f] hover:text-[#1b2b20] p-1 -mr-1 -mt-1 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
