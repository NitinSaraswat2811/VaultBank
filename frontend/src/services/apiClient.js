import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
});

// Har request se pehle latest token attach karo
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Backend se 401 aane par authentication reset karo
api.interceptors.response.use(
    (response) => response,

    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Agar accounts localStorage me save nahi karte,
            // to is line ki zaroorat nahi hai.
            localStorage.removeItem('accounts');

            window.location.href = '/';
        }

        return Promise.reject(error);
    }
);

export default api;