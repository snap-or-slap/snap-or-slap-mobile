import api from './api.service';

const friendsService = {
	async getOverview() {
		return api.get('/friends/overview', true);
	},

	async sendRequest(username) {
		return api.post('/friends/requests', { username }, true);
	},

	async acceptRequest(requestId) {
		return api.patch(`/friends/requests/${requestId}/accept`, {}, true);
	},

	async declineRequest(requestId) {
		return api.patch(`/friends/requests/${requestId}/decline`, {}, true);
	},

	async removeFriend(friendId) {
		return api.delete(`/friends/${friendId}`, true);
	},
};

export default friendsService;