import {
  NOTIFICATIONS_FETCH_START,
  NOTIFICATIONS_FETCH_SUCCESS,
  NOTIFICATIONS_FETCH_FAIL,
  NOTIFICATION_RECEIVED,
  NOTIFICATION_MARKED_READ,
  NOTIFICATIONS_MARKED_ALL_READ,
  LOG_OUT,
} from '../actionTypes';

const initialState = {
  items: [],
  loading: false,
  error: null,
  unread: 0,
};

const normalize = (notification) => {
  if (!notification) {
    return null;
  }
  const result = { ...notification };
  if (!result.id && notification._id) {
    result.id = notification._id;
  }
  return result;
};

const dedupe = (items) => {
  const seen = new Set();
  return items.filter((item) => {
    const key = item.id || item._id;
    if (!key) {
      return true;
    }
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case NOTIFICATIONS_FETCH_START:
      return { ...state, loading: true, error: null };
    case NOTIFICATIONS_FETCH_SUCCESS: {
      const incoming = Array.isArray(action.data?.items) ? action.data.items.map(normalize) : [];
      const unread = incoming.reduce((count, item) => (item?.read ? count : count + 1), 0);
      return { ...state, items: incoming, unread, loading: false, error: null };
    }
    case NOTIFICATIONS_FETCH_FAIL:
      return { ...state, loading: false, error: action.error };
    case NOTIFICATION_RECEIVED: {
      const record = normalize(action.data);
      if (!record) {
        return state;
      }
      const items = dedupe([record, ...state.items]);
      const unread = record.read ? state.unread : state.unread + 1;
      return { ...state, items, unread };
    }
    case NOTIFICATION_MARKED_READ: {
      const updated = normalize(action.data);
      if (!updated?.id) {
        return state;
      }
      let unread = state.unread;
      const items = state.items.map((item) => {
        if ((item.id || item._id) === updated.id) {
          if (!item.read) {
            unread = Math.max(0, unread - 1);
          }
          return { ...item, read: true };
        }
        return item;
      });
      return { ...state, items, unread };
    }
    case NOTIFICATIONS_MARKED_ALL_READ: {
      if (state.unread === 0) {
        return state;
      }
      const items = state.items.map((item) => ({ ...item, read: true }));
      return { ...state, items, unread: 0 };
    }
    case LOG_OUT:
      return initialState;
    default:
      return state;
  }
};

export default notificationReducer;
