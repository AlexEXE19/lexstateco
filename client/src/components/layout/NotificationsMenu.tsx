import { Bell } from "lucide-react";
import { Notification } from "../../schemas/Notification";

interface NotificationsMenuProps {
  notifications: Notification[];
  isOpen: boolean;
  onToggle: () => void;
  onClear: () => void;
  onNotificationClick: (notification: Notification) => void;
}

const NotificationsMenu: React.FC<NotificationsMenuProps> = ({
  notifications,
  isOpen,
  onToggle,
  onClear,
  onNotificationClick,
}) => {
  const notificationCount = notifications.length;

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Notifications"
        onClick={onToggle}
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-white  transition hover:bg-white/15"
      >
        <Bell />
        {notificationCount > 0 && (
          <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1.5 text-[11px] font-bold leading-none shadow-lg shadow-rose-500/30">
            {notificationCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 overflow-hidden rounded-2xl bg-background-surface/95 text-sm text-white shadow-2xl shadow-black/30 ring-1 ring-white/15 backdrop-blur">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <span className="text-xs uppercase tracking-[0.08em] text-slate-200">
              Notifications
            </span>
            <button
              type="button"
              onClick={onClear}
              className="text-xs font-semibold text-slate-200 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              disabled={notificationCount === 0}
            >
              Clear
            </button>
          </div>

          {notificationCount === 0 ? (
            <div className="px-4 py-6 text-center text-slate-300">
              You're all caught up — no notifications.
            </div>
          ) : (
            <ul className="max-h-72 divide-y divide-white/5 overflow-auto">
              {notifications.map((notification: Notification) => (
                <button
                  key={notification.id}
                  onClick={() => onNotificationClick(notification)}
                  className="flex w-full gap-3 px-4 py-3 text-left transition hover:bg-white/5"
                >
                  <div className="mt-1 h-2.5 w-2.5 rounded-full bg-primary-400" />
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold">
                      {notification.title}
                    </span>
                    <p className="text-xs text-slate-200">
                      {notification.description}
                    </p>
                    <span className="text-[11px] uppercase tracking-[0.08em] text-slate-400">
                      {/* TO DO UPDATE WITH NEW SCHEMA */}
                    </span>
                  </div>
                </button>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsMenu;
