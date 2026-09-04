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
        className="relative flex h-9 w-9 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-background-elevated hover:text-ink"
      >
        <Bell size={18} />
        {notificationCount > 0 && (
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-secondary-500 ring-2 ring-canvas" />
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={onToggle} />
          <div className="absolute right-0 z-20 mt-2 w-80 overflow-hidden rounded-lg border border-line bg-background-surface shadow-panel">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <span className="eyebrow">Notifications</span>
              <button
                type="button"
                onClick={onClear}
                className="text-xs font-medium text-ink-muted transition-colors hover:text-ink disabled:opacity-40"
                disabled={notificationCount === 0}
              >
                Clear
              </button>
            </div>

            {notificationCount === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-ink-subtle">
                You're all caught up.
              </p>
            ) : (
              <ul className="max-h-80 divide-y divide-line overflow-auto">
                {notifications.map((notification: Notification) => (
                  <li key={notification.id}>
                    <button
                      onClick={() => onNotificationClick(notification)}
                      className="flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-background-elevated"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-ink">
                          {notification.title}
                        </span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-ink-muted">
                          {notification.description}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationsMenu;
