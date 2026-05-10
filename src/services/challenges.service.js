import api from './api.service';

const challengesService = {
	async getOverview() {
		return api.get('/challenges/overview', true);
	},

	async createChallenge(data) {
		return api.post('/challenges', data, true);
	},

	async getDetail(challengeId) {
		return api.get(`/challenges/${challengeId}`, true);
	},

	async leaveChallenge(challengeId) {
		return api.delete(`/challenges/${challengeId}/leave`, true);
	},

	async inviteMembers(challengeId, inviteeIds) {
		return api.post(`/challenges/${challengeId}/invites`, { inviteeIds }, true);
	},

	async acceptInvite(inviteId) {
		return api.patch(`/challenges/invites/${inviteId}/accept`, {}, true);
	},

	async declineInvite(inviteId) {
		return api.patch(`/challenges/invites/${inviteId}/decline`, {}, true);
	},

	async submitEvidence(challengeId, payload) {
		return api.post(`/challenges/${challengeId}/evidence`, payload, true);
	},

	async markNotificationsRead() {
		return api.patch('/challenges/notifications/read-all', {}, true);
	},
};

export default challengesService;