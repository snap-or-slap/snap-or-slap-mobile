import React, { useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';
import challengesService from '../services/challenges.service';

const MAX_ACTIVITIES = 5;

function createWindow() {
	return {
		id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
		startTime: '06:00',
		endTime: '07:00',
	};
}

function createActivity(index = 0) {
	return {
		id: `activity-${Date.now()}-${index}-${Math.random().toString(16).slice(2)}`,
		name: '',
		timeWindows: [createWindow()],
	};
}

export default function ChallengeCreateScreen({ navigation, route }) {
	const friends = route.params?.friends || [];
	const [name, setName] = useState('');
	const [startsOn, setStartsOn] = useState('2026-05-10');
	const [endsOn, setEndsOn] = useState('2026-05-31');
	const [activities, setActivities] = useState([createActivity(0)]);
	const [selectedFriendIds, setSelectedFriendIds] = useState([]);
	const [submitting, setSubmitting] = useState(false);

	const updateActivity = (activityId, patch) => {
		setActivities((current) =>
			current.map((activity) => (activity.id === activityId ? { ...activity, ...patch } : activity)),
		);
	};

	const removeActivity = (activityId) => {
		if (activities.length === 1) {
			return;
		}
		setActivities((current) => current.filter((activity) => activity.id !== activityId));
	};

	const addActivity = () => {
		if (activities.length >= MAX_ACTIVITIES) {
			Alert.alert('Đã đủ hoạt động', `Mỗi challenge tối đa ${MAX_ACTIVITIES} hoạt động trong ngày`);
			return;
		}
		setActivities((current) => [...current, createActivity(current.length)]);
	};

	const addTimeWindow = (activityId) => {
		setActivities((current) =>
			current.map((activity) =>
				activity.id === activityId
					? { ...activity, timeWindows: [...activity.timeWindows, createWindow()] }
					: activity,
			),
		);
	};

	const removeTimeWindow = (activityId, windowId) => {
		setActivities((current) =>
			current.map((activity) => {
				if (activity.id !== activityId || activity.timeWindows.length === 1) {
					return activity;
				}
				return {
					...activity,
					timeWindows: activity.timeWindows.filter((timeWindow) => timeWindow.id !== windowId),
				};
			}),
		);
	};

	const updateTimeWindow = (activityId, windowId, patch) => {
		setActivities((current) =>
			current.map((activity) => {
				if (activity.id !== activityId) {
					return activity;
				}
				return {
					...activity,
					timeWindows: activity.timeWindows.map((timeWindow) =>
						timeWindow.id === windowId ? { ...timeWindow, ...patch } : timeWindow,
					),
				};
			}),
		);
	};

	const toggleFriend = (friendId) => {
		setSelectedFriendIds((current) =>
			current.includes(friendId)
				? current.filter((id) => id !== friendId)
				: [...current, friendId].slice(0, 6),
		);
	};

	const handleSubmit = async () => {
		if (!name.trim()) {
			Alert.alert('Thiếu thông tin', 'Hãy nhập tên challenge');
			return;
		}

		const normalizedActivities = activities.map((activity) => ({
			name: activity.name.trim(),
			timeWindows: activity.timeWindows.map((timeWindow) => ({
				startTime: timeWindow.startTime.trim(),
				endTime: timeWindow.endTime.trim() || undefined,
			})),
		}));

		if (normalizedActivities.some((activity) => !activity.name)) {
			Alert.alert('Thiếu hoạt động', 'Mỗi hoạt động cần có tên riêng');
			return;
		}

		if (normalizedActivities.some((activity) => activity.timeWindows.some((timeWindow) => !timeWindow.startTime))) {
			Alert.alert('Thiếu giờ hoạt động', 'Mỗi khung giờ cần có giờ bắt đầu dạng HH:mm');
			return;
		}

		try {
			setSubmitting(true);
			const result = await challengesService.createChallenge({
				name: name.trim(),
				startsOn,
				endsOn,
				activities: normalizedActivities,
				initialInviteeIds: selectedFriendIds,
			});
			Alert.alert('Đã tạo challenge', 'Challenge nhiều hoạt động đã sẵn sàng');
			navigation.replace('ChallengeDetail', { challengeId: result.challenge.id });
		} catch (error) {
			Alert.alert('Không tạo được challenge', error.message || 'Có lỗi xảy ra');
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
			<View style={styles.header}>
				<TouchableOpacity onPress={() => navigation.goBack()}>
					<Text style={styles.backText}>Back</Text>
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Create Challenge</Text>
				<View style={styles.headerSpacer} />
			</View>

			<ScrollView contentContainerStyle={styles.content}>
				<View style={styles.card}>
					<Text style={styles.label}>Tên challenge</Text>
					<TextInput
						style={styles.input}
						placeholder="Ví dụ: Giảm cân cùng nhau"
						value={name}
						onChangeText={setName}
					/>

					<View style={styles.dateRow}>
						<View style={styles.dateCol}>
							<Text style={styles.label}>Bắt đầu</Text>
							<TextInput style={styles.input} value={startsOn} onChangeText={setStartsOn} />
						</View>
						<View style={styles.dateCol}>
							<Text style={styles.label}>Kết thúc</Text>
							<TextInput style={styles.input} value={endsOn} onChangeText={setEndsOn} />
						</View>
					</View>

					<Text style={styles.helper}>Định dạng ngày: YYYY-MM-DD. Mỗi challenge tối đa 2 tháng.</Text>
				</View>

				<View style={styles.card}>
					<View style={styles.blockHeader}>
						<View>
							<Text style={styles.blockTitle}>Hoạt động trong ngày</Text>
							<Text style={styles.helper}>Tối đa 5 hoạt động, mỗi hoạt động có nhiều khung giờ.</Text>
						</View>
						<TouchableOpacity style={styles.addSmallBtn} onPress={addActivity}>
							<Text style={styles.addSmallBtnText}>+ Thêm activity</Text>
						</TouchableOpacity>
					</View>

					{activities.map((activity, activityIndex) => (
						<View key={activity.id} style={styles.activityCard}>
							<View style={styles.activityHeader}>
								<Text style={styles.activityTitle}>Hoạt động {activityIndex + 1}</Text>
								{activities.length > 1 ? (
									<TouchableOpacity onPress={() => removeActivity(activity.id)}>
										<Text style={styles.removeText}>Xóa</Text>
									</TouchableOpacity>
								) : null}
							</View>

							<TextInput
								style={styles.input}
								placeholder="Ví dụ: Cardio"
								value={activity.name}
								onChangeText={(value) => updateActivity(activity.id, { name: value })}
							/>

							{activity.timeWindows.map((timeWindow, windowIndex) => (
								<View key={timeWindow.id} style={styles.timeWindowCard}>
									<View style={styles.activityHeader}>
										<Text style={styles.timeWindowTitle}>Khung giờ {windowIndex + 1}</Text>
										{activity.timeWindows.length > 1 ? (
											<TouchableOpacity onPress={() => removeTimeWindow(activity.id, timeWindow.id)}>
												<Text style={styles.removeText}>Xóa giờ</Text>
											</TouchableOpacity>
										) : null}
									</View>
									<View style={styles.dateRow}>
										<View style={styles.dateCol}>
											<Text style={styles.label}>Từ</Text>
											<TextInput
												style={styles.input}
												placeholder="06:00"
												value={timeWindow.startTime}
												onChangeText={(value) => updateTimeWindow(activity.id, timeWindow.id, { startTime: value })}
											/>
										</View>
										<View style={styles.dateCol}>
											<Text style={styles.label}>Đến</Text>
											<TextInput
												style={styles.input}
												placeholder="07:00 hoặc để trống"
												value={timeWindow.endTime}
												onChangeText={(value) => updateTimeWindow(activity.id, timeWindow.id, { endTime: value })}
											/>
										</View>
									</View>
								</View>
							))}

							<TouchableOpacity style={styles.addInlineBtn} onPress={() => addTimeWindow(activity.id)}>
								<Text style={styles.addInlineBtnText}>+ Thêm khung giờ</Text>
							</TouchableOpacity>
						</View>
					))}
				</View>

				<View style={styles.card}>
					<Text style={styles.blockTitle}>Mời bạn bè ngay</Text>
					<Text style={styles.helper}>Tối đa 6 người ngoài bạn, và chỉ mời được bạn bè của bạn.</Text>
					<View style={styles.friendWrap}>
						{friends.length ? friends.map((friend) => {
							const selected = selectedFriendIds.includes(friend.id);
							return (
								<TouchableOpacity
									key={friend.id}
									style={[styles.friendChip, selected && styles.friendChipSelected]}
									onPress={() => toggleFriend(friend.id)}
								>
									<Text style={[styles.friendChipText, selected && styles.friendChipTextSelected]}>@{friend.username}</Text>
								</TouchableOpacity>
							);
						}) : <Text style={styles.helper}>Bạn chưa có bạn bè để mời.</Text>}
					</View>
				</View>

				<TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={submitting}>
					{submitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.submitText}>Tạo challenge</Text>}
				</TouchableOpacity>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: COLORS.background,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 20,
		paddingVertical: 14,
		borderBottomWidth: 1,
		borderBottomColor: '#F0E0D8',
	},
	backText: {
		fontSize: 14,
		fontWeight: '700',
		color: COLORS.primary,
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: '800',
		color: COLORS.primary,
	},
	headerSpacer: {
		width: 42,
	},
	content: {
		padding: 16,
		gap: 16,
	},
	card: {
		backgroundColor: '#FFFFFF',
		borderRadius: 24,
		padding: 16,
		gap: 12,
	},
	label: {
		fontSize: 13,
		fontWeight: '700',
		color: COLORS.textSecondary,
	},
	input: {
		height: 48,
		borderRadius: 16,
		paddingHorizontal: 14,
		backgroundColor: '#F8F2EE',
		color: COLORS.textPrimary,
	},
	dateRow: {
		flexDirection: 'row',
		gap: 10,
	},
	dateCol: {
		flex: 1,
		gap: 8,
	},
	blockHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		gap: 12,
	},
	blockTitle: {
		fontSize: 18,
		fontWeight: '800',
		color: COLORS.textPrimary,
	},
	helper: {
		fontSize: 13,
		lineHeight: 18,
		color: COLORS.textSecondary,
	},
	addSmallBtn: {
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 999,
		backgroundColor: '#FFF2EA',
	},
	addSmallBtnText: {
		fontSize: 13,
		fontWeight: '700',
		color: COLORS.primary,
	},
	activityCard: {
		padding: 14,
		borderRadius: 18,
		backgroundColor: '#FFF8F4',
		gap: 10,
	},
	activityHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 10,
	},
	activityTitle: {
		fontSize: 15,
		fontWeight: '800',
		color: COLORS.textPrimary,
	},
	timeWindowTitle: {
		fontSize: 14,
		fontWeight: '700',
		color: COLORS.primary,
	},
	removeText: {
		fontSize: 13,
		fontWeight: '700',
		color: '#C62828',
	},
	timeWindowCard: {
		padding: 12,
		borderRadius: 16,
		backgroundColor: '#FFFFFF',
		gap: 8,
	},
	addInlineBtn: {
		paddingVertical: 10,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 14,
		backgroundColor: '#FFEEDF',
	},
	addInlineBtnText: {
		fontSize: 13,
		fontWeight: '700',
		color: COLORS.primary,
	},
	friendWrap: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 10,
	},
	friendChip: {
		paddingHorizontal: 14,
		paddingVertical: 10,
		borderRadius: 999,
		backgroundColor: '#FFF5EF',
		borderWidth: 1,
		borderColor: '#EAD6CA',
	},
	friendChipSelected: {
		backgroundColor: COLORS.primary,
		borderColor: COLORS.primary,
	},
	friendChipText: {
		fontSize: 14,
		fontWeight: '700',
		color: COLORS.primary,
	},
	friendChipTextSelected: {
		color: '#FFFFFF',
	},
	submitBtn: {
		height: 52,
		borderRadius: 26,
		backgroundColor: COLORS.primary,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 12,
	},
	submitText: {
		fontSize: 16,
		fontWeight: '800',
		color: '#FFFFFF',
	},
});