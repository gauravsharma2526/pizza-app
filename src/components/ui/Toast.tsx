import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectNotifications } from '../../store/selectors';
import { removeNotification } from '../../store/slices/uiSlice';

/**
 * Toast notification container
 * Displays notifications from the global state
 */
export const ToastContainer: React.FC = () => {
  const notifications = useAppSelector(selectNotifications);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {notifications.map((notification) => (
        <Toast key={notification.id} {...notification} />
      ))}
    </div>
  );
};

interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ id, type, message, duration = 5000 }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeNotification(id));
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, dispatch]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const bgStyles = {
    success: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
    error: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
    warning: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800',
    info: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
  };

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-xl border shadow-lg animate-slide-in-right ${bgStyles[type]}`}
    >
      {icons[type]}
      <p className="flex-1 text-sm text-gray-800 dark:text-gray-200">{message}</p>
      <button
        onClick={() => dispatch(removeNotification(id))}
        className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
      >
        <X className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  );
};

export default ToastContainer;
