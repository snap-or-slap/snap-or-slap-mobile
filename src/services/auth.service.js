import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api.service';

const TOKEN_KEY = 'sos1_access_token';
const USER_KEY = 'sos1_user';

const authService = {
	async register(data) {
		const res = await api.post('/auth/register', data);
		await authService.saveSession(res);
		return res;
	},

	async login(data) {
		const res = await api.post('/auth/login', data);
		await authService.saveSession(res);
		return res;
	},

	async logout() {
		await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
	},

	async saveSession(res) {
		await AsyncStorage.setItem(TOKEN_KEY, res.accessToken);
		await AsyncStorage.setItem(USER_KEY, JSON.stringify(res.user));
	},

	async saveUser(user) {
		await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
	},

	async getToken() {
		return AsyncStorage.getItem(TOKEN_KEY);
	},

	async getUser() {
		const raw = await AsyncStorage.getItem(USER_KEY);
		if (!raw) return null;
		try {
			return JSON.parse(raw);
		} catch {
			return null;
		}
	},

	async isLoggedIn() {
		const token = await authService.getToken();
		return !!token;
	},
};

export default authService;
