import httpClient from '../../../api/httpClient';

export const getUser = (id, currentUserId = null) => {
  const params = currentUserId ? { userId: currentUserId } : {};
  return httpClient.get(`/user/${id}`, { params });
};

export const updateUser = (id, formData) => httpClient.put(`/user/${id}`, formData).then((response) => response.data);

export const getAllUsers = (limit = null, offset = 0) => {
  const params = {};
  if (limit !== null) params.limit = limit;
  if (offset > 0) params.offset = offset;
  return httpClient.get('/user', { params });
};

export const followUser = (id, data) => httpClient.post(`/user/${id}/follow`, data);

export const unfollowUser = (id, data) => httpClient.delete(`/user/${id}/follow`, { data });

export const getFollowCounts = (id) => httpClient.get(`/user/${id}/follow-counts`);

