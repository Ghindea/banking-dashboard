import axios from 'axios';

// Create a baseURL for the API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create an axios instance
const api = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Request interceptor for adding the auth token
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('accessToken');
		if (token) {
			config.headers['Authorization'] = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor for handling token expiration
api.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (error.response?.status === 401) {
			// Token expired or invalid
			localStorage.removeItem('accessToken');
			localStorage.removeItem('userType');
			localStorage.removeItem('userId');
			localStorage.removeItem('isAuthenticated');

			// Redirect to login page
			window.location.href = '/login';
		}
		return Promise.reject(error);
	}
);

export default api;