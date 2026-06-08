import { create } from 'zustand';
import { ToastState, Toast } from '@/types';

const generateId = (): string => {
  return `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  addToast: (toast) => {
    const id = generateId();
    const newToast: Toast = {
      ...toast,
      id,
    };
    set((state) => ({ toasts: [...state.toasts, newToast] }));

    if (toast.duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, toast.duration);
    }
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  clearToasts: () => {
    set({ toasts: [] });
  },
}));

export const showToast = (
  type: Toast['type'],
  message: string,
  duration = 3000
) => {
  useToastStore.getState().addToast({ type, message, duration });
};
