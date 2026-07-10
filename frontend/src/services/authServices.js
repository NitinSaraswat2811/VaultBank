import api from './apiClient';

export const loginUser = (formData) => api.post('/auth/login', formData);
export const registerUser = (formData) => api.post('/auth/register', formData);