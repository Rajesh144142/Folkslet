import httpClient from '../../../api/httpClient';

export const getLatestTrends = () => httpClient.get('/trends/latest').then((response) => response.data);
