import httpClient from '../../../api/httpClient';

export const userChats = (userId) => httpClient.get(`/chat/${userId}`);

export const createChat = (payload) => httpClient.post('/chat', payload);

