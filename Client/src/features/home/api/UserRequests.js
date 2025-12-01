import httpClient from '../../../api/httpClient';

export const getUser = (id) => httpClient.get(`/user/${id}`);

export const updateUser = (id, formData) => httpClient.put(`/user/${id}`, formData).then((response) => response.data);

export const getAllUsers = () => httpClient.get('/user');

export const followUser = (id, data) => httpClient.put(`/user/${id}/follow`, data);

export const unfollowUser = (id, data) => httpClient.put(`/user/${id}/unfollow`, data);

