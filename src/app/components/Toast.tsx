import { CheckCircle, XCircle, Info, AlertCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

const icons = {
  success: <CheckCircle className="size-5 text-green-500" />,
  error: <XCircle className="size-5 text-red-500" />,
  info: <Info className="size-5 text-blue-500" />,
  warning: <AlertCircle className="size-5 text-yellow-500" />,
};

const bgColors = {
  success: 'bg-green-50 border-green-300',
  error: 'bg-red-50 border-red-300',
  info: 'bg-blue-50 border-blue-300',
  warning: 'bg-yellow-50 border-yellow-300',
};

const textColors = {
  success: 'text-green-800',
  error: 'text-red-800',
  info: 'text-blue-800',
  warning: 'text-yellow-800',
};

export function Toast({ message, type, duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`transform transition-all duration-300 ease-out ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div
        className={`flex items-center gap-3 rounded-xl border ${bgColors[type]} p-4 shadow-lg min-w-[300px] max-w-md`}
        role="alert"
      >
        {icons[type]}
        <p className={`flex-1 text-sm font-medium ${textColors[type]}`}>{message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className={`rounded-lg p-1 transition-colors hover:bg-white/50 ${textColors[type]}`}
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}