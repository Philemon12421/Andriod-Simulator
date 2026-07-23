import React from 'react';
import { AlertTriangle, CheckCircle, Info, Trash2, X, XCircle } from 'lucide-react';
import { SystemNotification } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: SystemNotification[];
  onClearAll: () => void;
  onMarkRead: (id: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onClearAll,
  onMarkRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex justify-end animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
              Notification Center
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-medium">
              {notifications.length}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="p-1.5 text-zinc-400 hover:text-red-500 rounded-md transition-colors"
                title="Clear All Notifications"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500">
              No new notifications. Everything is running smoothly!
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => onMarkRead(item.id)}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  item.read
                    ? 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800/60 opacity-80'
                    : 'bg-white dark:bg-zinc-800 border-emerald-500/30 dark:border-emerald-500/40 shadow-xs'
                }`}
              >
                <div className="flex items-start space-x-2.5">
                  {item.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
                  {item.type === 'info' && <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />}
                  {item.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
                  {item.type === 'error' && <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-zinc-400">{item.time}</span>
                    </div>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-300 mt-0.5">
                      {item.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
