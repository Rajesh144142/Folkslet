import httpClient from './httpClient';

export const login = (credentials) => httpClient.post('/auth/login', credentials);

export const signUp = (payload) => httpClient.post('/auth/signup', payload);


