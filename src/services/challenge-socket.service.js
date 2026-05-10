import { io } from 'socket.io-client';
import config from '../config/api';
import authService from './auth.service';

let socket = null;
let activeToken = null;

function getBaseUrl() {
	return config.apiUrl.replace(/\/api\/?$/, '');
}

async function ensureSocket() {
	const token = await authService.getToken();
	if (!token) {
		return null;
	}

	if (socket && activeToken === token) {
		return socket;
	}

	if (socket) {
		socket.disconnect();
	}

	activeToken = token;
	socket = io(`${getBaseUrl()}/challenges`, {
		transports: ['websocket'],
		auth: { token },
	});

	return socket;
}

const challengeSocketService = {
	async subscribe(eventName, callback) {
		const instance = await ensureSocket();
		if (!instance) {
			return () => { };
		}

		instance.on(eventName, callback);
		return () => {
			instance.off(eventName, callback);
		};
	},

	async joinChallenge(challengeId) {
		const instance = await ensureSocket();
		instance?.emit('challenge.join', { challengeId });
	},

	disconnect() {
		if (socket) {
			socket.disconnect();
			socket = null;
			activeToken = null;
		}
	},
};

export default challengeSocketService;