import {
  NOTIFICATIONS_FETCH_START,
  NOTIFICATIONS_FETCH_SUCCESS,
  NOTIFICATIONS_FETCH_FAIL,
  NOTIFICATION_RECEIVED,
  NOTIFICATION_MARKED_READ,
  NOTIFICATIONS_MARKED_ALL_READ,
} from '../actionTypes';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../../features/home/api/NotificationRequests';

export const fetchNotifications = (userId, params) => async (dispatch) => {
  dispatch({ type: NOTIFICATIONS_FETCH_START });
  try {
    const data = await getNotifications(userId, params);
    dispatch({ type: NOTIFICATIONS_FETCH_SUCCESS, data });
  } catch (error) {
    dispatch({ type: NOTIFICATIONS_FETCH_FAIL, error: error.message });
  }
};

export const receiveNotification = (notification) => ({
  type: NOTIFICATION_RECEIVED,
  data: notification,
});

export const markNotificationAsRead = (notificationId) => async (dispatch) => {
  try {
    const data = await markNotificationRead(notificationId);
    dispatch({ type: NOTIFICATION_MARKED_READ, data });
  } catch (error) {
    // silently ignore for now
    dispatch({ type: NOTIFICATIONS_FETCH_FAIL, error: error.message });
  }
};

export const markAllNotificationsAsRead = (userId) => async (dispatch) => {
  try {
    await markAllNotificationsRead(userId);
    dispatch({ type: NOTIFICATIONS_MARKED_ALL_READ });
  } catch (error) {
    dispatch({ type: NOTIFICATIONS_FETCH_FAIL, error: error.message });
  }
};
