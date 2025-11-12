import httpClient from '../../../api/httpClient';

export const getTimelinePosts = (id, params) => httpClient.get(`/post/${id}/timeline`, { params });

export const likePost = (id, userId) =>
  httpClient.put(`/post/${id}/like`, { userId }).then((response) => response.data);

export const commentOnPost = (id, payload) =>
  httpClient.post(`/post/${id}`, payload).then((response) => response.data);

export const updatePost = (id, payload) =>
  httpClient.put(`/post/${id}`, payload).then((response) => response.data);

export const deletePost = (id, payload) =>
  httpClient.delete(`/post/${id}`, { data: payload }).then((response) => response.data);

