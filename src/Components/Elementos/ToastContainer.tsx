import { Toast } from './Toast';
import type { ToastType } from './Toast';
import { loadAccessibilityPreferences } from '../../utils/accessibilityPreferences';

interface ToastContainerProps {
  toasts: Array<{ id: number; message: string; type: ToastType }>;
  onRemove: (id: number) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  const toastDuration = loadAccessibilityPreferences().extraResponseTime ? 9000 : 3000;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2" aria-live="polite" aria-relevant="additions text">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toastDuration}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
}
