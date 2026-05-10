import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { enumerateDateKeys, isFutureVietnamDateTime } from '../utils/vietnam-time';

const STORAGE_KEY = 'sos1_challenge_reminder_ids';
const REMINDER_SIGNATURE_KEY = 'sos1_challenge_reminder_signature';
const SEEN_NOTIFICATION_IDS_KEY = 'sos1_challenge_seen_notification_ids';
const MAX_SEEN_NOTIFICATION_IDS = 200;
let reminderSyncLock = Promise.resolve();

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldPlaySound: true,
		shouldSetBadge: false,
		shouldShowBanner: true,
		shouldShowList: true,
	}),
});

function parseDateKey(dateKey) {
	const [year, month, day] = String(dateKey || '').split('-').map(Number);
	return { year, month, day };
}

function buildReminderPlan(challenges) {
	const reminders = [];

	for (const challenge of challenges || []) {
		if (challenge.status !== 'active') {
			continue;
		}

		for (const dateKey of enumerateDateKeys(challenge.startsOn, challenge.endsOn)) {
			for (const activity of challenge.activities || []) {
				for (const timeWindow of activity.timeWindows || []) {
					if (!isFutureVietnamDateTime(dateKey, timeWindow.startTime)) {
						continue;
					}

					reminders.push({
						key: `${challenge.id}:${activity.id}:${dateKey}:${timeWindow.startTime}`,
						challengeId: challenge.id,
						challengeName: challenge.name,
						activityId: activity.id,
						activityName: activity.name,
						dateKey,
						startTime: timeWindow.startTime,
						endTime: timeWindow.endTime || null,
					});
				}
			}
		}
	}

	return reminders.sort((left, right) => left.key.localeCompare(right.key));
}

function buildReminderSignature(reminders) {
	return JSON.stringify(reminders.map((item) => item.key));
}

export async function initializeChallengeNotifications() {
	await Notifications.requestPermissionsAsync();
	await Notifications.setNotificationChannelAsync('challenge-reminders', {
		name: 'Challenge reminders',
		importance: Notifications.AndroidImportance.HIGH,
	});
	await Notifications.setNotificationChannelAsync('challenge-events', {
		name: 'Challenge events',
		importance: Notifications.AndroidImportance.HIGH,
	});
}

async function getSeenNotificationIds() {
	const raw = await AsyncStorage.getItem(SEEN_NOTIFICATION_IDS_KEY);
	return raw ? JSON.parse(raw) : [];
}

async function markNotificationAsSeen(notificationId) {
	const seenIds = await getSeenNotificationIds();
	const nextSeenIds = [...seenIds.filter((item) => item !== notificationId), notificationId]
		.slice(-MAX_SEEN_NOTIFICATION_IDS);
	await AsyncStorage.setItem(SEEN_NOTIFICATION_IDS_KEY, JSON.stringify(nextSeenIds));
}

export async function showRealtimeChallengeNotification(notification) {
	if (!notification?.id || !notification?.title || !notification?.body) {
		return false;
	}

	const seenIds = await getSeenNotificationIds();
	if (seenIds.includes(notification.id)) {
		return false;
	}

	await Notifications.scheduleNotificationAsync({
		content: {
			title: notification.title,
			body: notification.body,
			sound: true,
			data: {
				type: notification.type,
				challengeId: notification.challengeId,
				notificationId: notification.id,
				...(notification.metadata || {}),
			},
		},
		trigger: null,
	});

	await markNotificationAsSeen(notification.id);
	return true;
}

export async function syncChallengeReminders(challenges) {
	let releaseLock;
	const previousLock = reminderSyncLock;
	reminderSyncLock = new Promise((resolve) => {
		releaseLock = resolve;
	});

	await previousLock;

	try {
		const reminders = buildReminderPlan(challenges);
		const nextSignature = buildReminderSignature(reminders);
		const previousSignature = await AsyncStorage.getItem(REMINDER_SIGNATURE_KEY);
		if (previousSignature === nextSignature) {
			return [];
		}

		const rawReminderIds = await AsyncStorage.getItem(STORAGE_KEY);
		const previousReminderIds = rawReminderIds ? JSON.parse(rawReminderIds) : [];
		await Promise.all(previousReminderIds.map((identifier) => Notifications.cancelScheduledNotificationAsync(identifier)));

		const nextIds = [];
		for (const reminder of reminders) {
			const { year, month, day } = parseDateKey(reminder.dateKey);
			const [hour, minute] = String(reminder.startTime || '09:00').split(':').map(Number);

			const identifier = await Notifications.scheduleNotificationAsync({
				content: {
					title: `Đến giờ ${reminder.activityName} trong ${reminder.challengeName}`,
					body: reminder.endTime
						? `Bây giờ là khung giờ ${reminder.startTime} - ${reminder.endTime}. Hãy hoàn thành hoạt động ${reminder.activityName} của challenge ${reminder.challengeName}.`
						: `Bây giờ là mốc ${reminder.startTime}. Hãy hoàn thành hoạt động ${reminder.activityName} của challenge ${reminder.challengeName}.`,
					sound: true,
					data: {
						kind: 'challenge-reminder',
						reminderKey: reminder.key,
						challengeId: reminder.challengeId,
						activityId: reminder.activityId,
					},
				},
				trigger: {
					channelId: 'challenge-reminders',
					year,
					month,
					day,
					hour,
					minute,
				},
			});
			nextIds.push(identifier);
		}

		await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextIds));
		await AsyncStorage.setItem(REMINDER_SIGNATURE_KEY, nextSignature);
		return nextIds;
	} finally {
		releaseLock();
	}
}