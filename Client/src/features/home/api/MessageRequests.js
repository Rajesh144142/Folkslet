import httpClient from '../../../api/httpClient';

export const getMessages = (chatId) => httpClient.get(`/message/${chatId}`);

export const addMessage = (payload) => httpClient.post('/message', payload);

