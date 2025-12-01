import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoNotificationsOutline } from 'react-icons/io5';
import { format } from 'timeago.js';

import {
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../../../redux/actions/NotificationActions';
import { assetUrl } from '../../../utils/assets';

const buildMessage = (notification) => {
  const actorName = notification?.meta?.actor?.name || 'Someone';
  switch (notification?.type) {
    case 'follow':
      return `${actorName} started following you`;
    case 'like':
      return `${actorName} liked your post`;
    case 'share':
      return `${actorName} shared your post`;
    case 'message':
      return `${actorName} sent you a message`;
    case 'digest': {
      const counts = notification?.meta?.counts || {};
      const parts = Object.entries(counts)
        .filter(([, count]) => count > 0)
        .map(([type, count]) => `${count} ${type}${count > 1 ? 's' : ''}`);
      if (parts.length === 0) {
        return 'Daily activity summary';
      }
      return `Daily summary: ${parts.join(', ')}`;
    }
    default:
      return notification?.meta?.message || 'You have a new notification';
  }
};

const buildPreview = (notification) => {
  if (notification?.type === 'message') {
    return notification?.meta?.preview;
  }
  if (notification?.type === 'like' || notification?.type === 'share') {
    return notification?.meta?.post?.desc;
  }
  if (notification?.type === 'digest') {
    const windowMeta = notification?.meta?.window;
    if (windowMeta?.start && windowMeta?.end) {
      return `Covering activity from ${new Date(windowMeta.start).toLocaleDateString()} to ${new Date(
        windowMeta.end,
      ).toLocaleDateString()}`;
    }
  }
  return notification?.meta?.preview;
};

const NotificationsPage = () => {
  const dispatch = useDispatch();
  const { items, loading, unread } = useSelector((state) => state.notification);
  const userId = useSelector((state) => state.authReducer.authData?.user?._id);

  const notifications = useMemo(() => (Array.isArray(items) ? items : []), [items]);

  const handleMarkAll = () => {
    if (userId) {
      dispatch(markAllNotificationsAsRead(userId));
    }
  };

  const handleMarkRead = (notification) => {
    if (!notification?.id || notification.read) {
      return;
    }
    dispatch(markNotificationAsRead(notification.id));
  };

  return (
    <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-6 px-4 pb-12 lg:px-8">
      <header className="flex flex-wrap items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)] text-2xl text-[var(--color-on-primary)]">
          <IoNotificationsOutline />
        </span>
        <div className="mr-auto flex flex-col gap-1">
          <h1 className="text-3xl font-semibold text-[var(--color-text-base)]">Notifications</h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            Stay up to date with follows, likes, shares, and messages.
          </p>
        </div>
        <button
          type="button"
          onClick={handleMarkAll}
          disabled={unread === 0}
          className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-text-base)] transition hover:bg-[var(--color-border)]/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Mark all as read
        </button>
      </header>
      <section className="flex flex-col gap-4">
        {loading && notifications.length === 0 && (
          <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-sm text-[var(--color-text-muted)]">
            Loading notifications…
          </div>
        )}
        {!loading && notifications.length === 0 && (
          <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-sm text-[var(--color-text-muted)]">
            No notifications yet. Interact with people to see updates here.
          </div>
        )}
        {notifications.map((notification) => {
          const message = buildMessage(notification);
          const preview = buildPreview(notification);
          const actorAvatar = notification?.meta?.actor?.avatar;
          const read = Boolean(notification?.read);
          return (
            <article
              key={notification.id || notification._id}
              className={`flex items-start gap-4 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm transition hover:shadow-md ${
                read ? '' : 'border-[var(--color-primary)]/40'
              }`}
              onMouseEnter={() => handleMarkRead(notification)}
            >
              <img
                className="h-12 w-12 flex-shrink-0 rounded-full border border-[var(--color-border)] object-cover"
                src={assetUrl(actorAvatar, 'defaultProfile.png')}
                alt={notification?.meta?.actor?.name || 'User avatar'}
              />
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm text-[var(--color-text-base)]">{message}</p>
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {format(notification?.createdAt || notification?.updatedAt || new Date())}
                  </span>
                </div>
                {preview && <p className="text-sm text-[var(--color-text-muted)]">{preview}</p>}
              </div>
              {!read && <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[var(--color-primary)]" />}
            </article>
          );
        })}
      </section>
    </div>
  );
};

export default NotificationsPage;
