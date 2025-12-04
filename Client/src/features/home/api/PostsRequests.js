import httpClient from '../../../api/httpClient';

export const getTimelinePosts = (id, params) => httpClient.get(`/post/timeline/${id}`, { params });

export const likePost = (id, userId) =>
  httpClient.post(`/post/${id}/like`, { userId }).then((response) => response.data);

export const commentOnPost = (id, payload) =>
  httpClient.post(`/post/${id}/comments`, payload).then((response) => response.data);

export const updatePost = (id, payload) =>
  httpClient.put(`/post/${id}`, payload).then((response) => response.data);

export const deletePost = (id, payload) =>
  httpClient.delete(`/post/${id}`, { data: payload }).then((response) => response.data);

