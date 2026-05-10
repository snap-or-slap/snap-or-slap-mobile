import Constants from 'expo-constants';

// Trên Android Emulator: 10.0.2.2 trỏ đến localhost của máy host
// Trên thiết bị thật: đổi thành IP LAN của máy dev
const API_URL =
	Constants.expoConfig?.extra?.apiUrl || 'http://10.0.2.2:3000/api';

export const config = {
	apiUrl: API_URL,
};

export default config;
