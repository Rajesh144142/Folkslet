import httpClient from '../../../api/httpClient';

export const uploadImage = (formData) => httpClient.post('/upload', formData);

export const uploadPost = (formData) => httpClient.post('/post', formData);

