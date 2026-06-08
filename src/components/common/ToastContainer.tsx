import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToastStore } from '@/store/useToastStore';
import { cn } from '@/utils/cn';
import { Toast } from '@/types';

const ToastIcon: Record<Toast['type'], React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5 text-green-400" />,
  error: <XCircle className="w-5 h-5 text-neon-pink" />,
  warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
  info: <Info className="w-5 h-5 text-neon-cyan" />,
};

const ToastBg: Record<Toast['type'], string> = {
  success: 'border-green-400/30 bg-green-400/10',
  error: 'border-neon-pink/30 bg-neon-pink/10',
  warning: 'border-yellow-400/30 bg-yellow-400/10',
  info: 'border-neon-cyan/30 bg-neon-cyan/10',
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl',
            'animate-slide-up shadow-2xl pointer-events-auto',
            ToastBg[toast.type]
          )}
        >
          {ToastIcon[toast.type]}
          <p className="flex-1 text-sm text-white/90">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-white/40 hover:text-white/70 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
