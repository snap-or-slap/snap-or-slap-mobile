import api from './api.service';

const usersService = {
	async getMe() {
		return api.get('/users/me', true);
	},

	async updateMe(data) {
		return api.patch('/users/me', data, true);
	},

	async getById(id) {
		return api.get(`/users/${id}`, true);
	},

	async checkUsername(username) {
		return api.get(`/users/check-username/${encodeURIComponent(username)}`);
	},
};

export default usersService;