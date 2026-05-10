import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config/api';

const TOKEN_KEY = 'sos1_access_token';

async function getAuthHeader(): Promise<Record<string, string>> {
	const token = await AsyncStorage.getItem(TOKEN_KEY);
	return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(
	endpoint: string,
	options: RequestInit = {},
	authenticated = false,
): Promise<T> {
	const url = `${config.apiUrl}${endpoint}`;
	const authHeader = authenticated ? await getAuthHeader() : {};
	const response = await fetch(url, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...authHeader,
			...options.headers,
		},
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({ message: 'Lỗi mạng' }));
		throw new Error(error.message || `HTTP ${response.status}`);
	}

	return response.json();
}

export const api = {
	get: <T>(endpoint: string, authenticated = false) =>
		request<T>(endpoint, { method: 'GET' }, authenticated),

	post: <T>(endpoint: string, body: unknown, authenticated = false) =>
		request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }, authenticated),

	patch: <T>(endpoint: string, body: unknown, authenticated = false) =>
		request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) }, authenticated),

	put: <T>(endpoint: string, body: unknown, authenticated = false) =>
		request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }, authenticated),

	delete: <T>(endpoint: string, authenticated = false) =>
		request<T>(endpoint, { method: 'DELETE' }, authenticated),
};

export default api;
