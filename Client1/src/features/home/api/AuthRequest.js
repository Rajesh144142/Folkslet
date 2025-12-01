import httpClient from '../../../api/httpClient';

export const logIn = (formData) => httpClient.post('/auth/login', formData);

export const signUp = (formData) => httpClient.post('/auth/register', formData);

