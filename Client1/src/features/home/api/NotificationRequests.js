import httpClient from '../../../api/httpClient';

export const getNotifications = (userId, params) =>
  httpClient.get(`/notifications/${userId}`, { params }).then((response) => response.data);

export const markNotificationRead = (notificationId) =>
  httpClient.patch(`/notifications/${notificationId}/read`).then((response) => response.data);

export const markAllNotificationsRead = (userId) =>
  httpClient.patch(`/notifications/user/${userId}/read`).then((response) => response.data);
