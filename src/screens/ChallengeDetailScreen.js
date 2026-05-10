import React, { useCallback, useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	Image,
	RefreshControl,
	ScrollView as HorizontalScrollView,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import * as LegacyFileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AvatarView from '../components/AvatarView';
import { COLORS } from '../constants/theme';
import challengeSocketService from '../services/challenge-socket.service';
import challengesService from '../services/challenges.service';
import { toMinutes, toVietnamDateKey, toVietnamMinutes } from '../utils/vietnam-time';

function isDateWithinChallenge(now, challenge) {
	const dateKey = toVietnamDateKey(now);
	return dateKey >= challenge.startsOn && dateKey <= challenge.endsOn;
}

function getCurrentWindow(activity, now) {
	const currentMinutes = toVietnamMinutes(now);
	return (activity.timeWindows || []).find((timeWindow) => {
		const startMinutes = toMinutes(timeWindow.startTime);
		const endMinutes = timeWindow.endTime ? toMinutes(timeWindow.endTime) : startMinutes + 59;
		return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
	}) || null;
}

function isActivityActiveNow(challenge, activity, now) {
	return isDateWithinChallenge(now, challenge) && !!getCurrentWindow(activity, now);
}

function formatFeedDateLabel(dateKey) {
	const [year, month, day] = String(dateKey || '').split('-').map(Number);
	const date = new Date(Date.UTC(year, month - 1, day));
	return date.toLocaleDateString('vi-VN', {
		timeZone: 'UTC',
		weekday: 'long',
		day: '2-digit',
		month: '2-digit',
	});
}

function buildFeedGroups(feed = []) {
	const grouped = new Map();
	for (const item of feed) {
		const items = grouped.get(item.sessionDate) || [];
		items.push(item);
		grouped.set(item.sessionDate, items);
	}

	return [...grouped.entries()]
		.sort((left, right) => right[0].localeCompare(left[0]))
		.map(([date, items]) => ({
			date,
			label: formatFeedDateLabel(date),
			items,
		}));
}

async function toDataUrl(asset) {
	const base64 = await LegacyFileSystem.readAsStringAsync(asset.uri, {
		encoding: 'base64',
	});
	const mimeType = asset.mimeType || (asset.type === 'video' ? 'video/mp4' : 'image/jpeg');
	return `data:${mimeType};base64,${base64}`;
}

function MediaBlock({ item }) {
	if (item.mediaType === 'video') {
		return (
			<Video
				style={styles.feedMedia}
				source={{ uri: item.mediaUrl }}
				useNativeControls
				resizeMode={ResizeMode.COVER}
				isLooping={false}
			/>
		);
	}

	return <Image source={{ uri: item.mediaUrl }} style={styles.feedMedia} />;
}

export default function ChallengeDetailScreen({ navigation, route }) {
	const { challengeId } = route.params;
	const [detail, setDetail] = useState(null);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [submittingActivityId, setSubmittingActivityId] = useState(null);
	const [inviting, setInviting] = useState(false);
	const [selectedInviteIds, setSelectedInviteIds] = useState([]);
	const [nowTick, setNowTick] = useState(Date.now());
	const [selectedFeedDate, setSelectedFeedDate] = useState(null);

	const loadDetail = useCallback(async (showRefresh = false) => {
		try {
			if (showRefresh) {
				setRefreshing(true);
			} else {
				setLoading(true);
			}
			const data = await challengesService.getDetail(challengeId);
			setDetail(data.challenge);
		} catch (error) {
			Alert.alert('Không tải được challenge', error.message || 'Có lỗi xảy ra');
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, [challengeId]);

	useFocusEffect(
		useCallback(() => {
			loadDetail();
		}, [loadDetail]),
	);

	useEffect(() => {
		const timer = setInterval(() => setNowTick(Date.now()), 30000);
		return () => clearInterval(timer);
	}, []);

	useEffect(() => {
		const feedGroups = buildFeedGroups(detail?.feed || []);
		if (!feedGroups.length) {
			if (selectedFeedDate !== null) {
				setSelectedFeedDate(null);
			}
			return;
		}

		const todayKey = toVietnamDateKey(new Date());
		const defaultDate = feedGroups.find((group) => group.date === todayKey)?.date || feedGroups[0].date;
		const stillExists = selectedFeedDate && feedGroups.some((group) => group.date === selectedFeedDate);
		if (!stillExists || !selectedFeedDate) {
			setSelectedFeedDate(defaultDate);
		}
	}, [detail?.feed, selectedFeedDate]);

	useEffect(() => {
		let unsubUpdate = null;
		let unsubNotification = null;
		let mounted = true;

		(async () => {
			await challengeSocketService.joinChallenge(challengeId);
			unsubUpdate = await challengeSocketService.subscribe('challenge.updated', (payload) => {
				if (mounted && payload?.challengeId === challengeId) {
					loadDetail(true);
				}
			});
			unsubNotification = await challengeSocketService.subscribe('challenge.notification', (payload) => {
				if (mounted && payload?.notification?.challengeId === challengeId) {
					loadDetail(true);
				}
			});
		})();

		return () => {
			mounted = false;
			unsubUpdate?.();
			unsubNotification?.();
		};
	}, [challengeId, loadDetail]);

	const handleLeaveChallenge = () => {
		Alert.alert('Rời challenge', 'Bạn chắc chắn muốn rời khỏi challenge này?', [
			{ text: 'Ở lại', style: 'cancel' },
			{
				text: 'Rời challenge',
				style: 'destructive',
				onPress: async () => {
					try {
						await challengesService.leaveChallenge(challengeId);
						Alert.alert('Đã rời challenge', 'Bạn đã rời khỏi challenge này.');
						navigation.goBack();
					} catch (error) {
						Alert.alert('Không thể rời challenge', error.message || 'Có lỗi xảy ra');
					}
				},
			},
		]);
	};

	const toggleInvite = (userId) => {
		setSelectedInviteIds((current) =>
			current.includes(userId)
				? current.filter((id) => id !== userId)
				: [...current, userId].slice(0, 6),
		);
	};

	const handleInviteMembers = async () => {
		if (!selectedInviteIds.length) {
			Alert.alert('Chưa chọn ai', 'Hãy chọn ít nhất một bạn bè để mời');
			return;
		}

		try {
			setInviting(true);
			await challengesService.inviteMembers(challengeId, selectedInviteIds);
			setSelectedInviteIds([]);
			await loadDetail(true);
			Alert.alert('Đã gửi lời mời', 'Bạn bè của bạn đã được mời vào challenge');
		} catch (error) {
			Alert.alert('Không mời được', error.message || 'Có lỗi xảy ra');
		} finally {
			setInviting(false);
		}
	};

	const handleUploadEvidence = async (activity) => {
		try {
			const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
			if (!permission.granted) {
				Alert.alert('Thiếu quyền', 'Hãy cho phép ứng dụng truy cập thư viện');
				return;
			}

			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.All,
				quality: 0.6,
				videoMaxDuration: 30,
			});

			if (result.canceled || !result.assets?.length) {
				return;
			}

			const asset = result.assets[0];
			const durationSeconds = asset.duration ? Math.ceil(asset.duration / 1000) : undefined;
			if (asset.type === 'video' && durationSeconds && durationSeconds > 30) {
				Alert.alert('Video quá dài', 'Chỉ chấp nhận video tối đa 30 giây');
				return;
			}

			setSubmittingActivityId(activity.id);
			const mediaUrl = await toDataUrl(asset);
			await challengesService.submitEvidence(challengeId, {
				activityId: activity.id,
				mediaType: asset.type === 'video' ? 'video' : 'image',
				mediaUrl,
				durationSeconds,
			});
			await loadDetail(true);
			Alert.alert('Đã đăng minh chứng', `Mọi người trong challenge có thể thấy bạn đã hoàn thành ${activity.name}`);
		} catch (error) {
			Alert.alert('Không đăng được minh chứng', error.message || 'Có lỗi xảy ra');
		} finally {
			setSubmittingActivityId(null);
		}
	};

	if (loading && !detail) {
		return (
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.loaderWrap}>
					<ActivityIndicator size="large" color={COLORS.primary} />
				</View>
			</SafeAreaView>
		);
	}

	const feedGroups = buildFeedGroups(detail?.feed || []);
	const activeFeedGroup = feedGroups.find((group) => group.date === selectedFeedDate) || feedGroups[0] || null;

	return (
		<SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
			<View style={styles.header}>
				<TouchableOpacity onPress={() => navigation.goBack()}>
					<Text style={styles.backText}>Back</Text>
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Challenge</Text>
				<View style={styles.headerSpacer} />
			</View>

			<ScrollView
				contentContainerStyle={styles.content}
				refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadDetail(true)} tintColor={COLORS.primary} />}
			>
				<View style={styles.heroCard}>
					<Text style={styles.heroTitle}>{detail?.name}</Text>
					<Text style={styles.heroSubtitle}>{detail?.activities?.length || 0} hoạt động mỗi ngày</Text>
					<Text style={styles.heroMeta}>Host: @{detail?.host?.username}</Text>
					<Text style={styles.heroMeta}>{detail?.startsOn} đến {detail?.endsOn}</Text>
					<TouchableOpacity style={styles.leaveButton} onPress={handleLeaveChallenge}>
						<Text style={styles.leaveButtonText}>Rời challenge</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.card}>
					<Text style={styles.sectionTitle}>Hoạt động hôm nay</Text>
					{detail?.activities?.map((activity) => {
						const now = new Date(nowTick);
						const activeNow = isActivityActiveNow(detail, activity, now);
						const currentWindow = getCurrentWindow(activity, now);
						return (
							<View key={activity.id} style={styles.activityCard}>
								<Text style={styles.activityName}>{activity.name}</Text>
								<Text style={styles.activityWindow}>{activity.windowLabel}</Text>
								<Text style={styles.activityHint}>
									{activeNow
										? `Đang trong khung giờ ${currentWindow?.label}. Bạn có thể đăng minh chứng ngay bây giờ.`
										: 'Chỉ có thể đăng minh chứng khi hoạt động đang ở đúng khung giờ hiện tại.'}
								</Text>
								<TouchableOpacity
									style={[styles.uploadButton, !activeNow && styles.uploadButtonDisabled]}
									onPress={() => handleUploadEvidence(activity)}
									disabled={submittingActivityId === activity.id || !activeNow}
								>
									{submittingActivityId === activity.id ? (
										<ActivityIndicator color="#FFFFFF" />
									) : (
										<Text style={styles.uploadButtonText}>
											{activeNow ? `Đăng minh chứng cho ${activity.name}` : `Chưa tới giờ ${activity.name}`}
										</Text>
									)}
								</TouchableOpacity>
							</View>
						);
					})}
				</View>

				<View style={styles.card}>
					<Text style={styles.sectionTitle}>Thành viên</Text>
					<View style={styles.membersWrap}>
						{detail?.members?.map((member) => (
							<View key={member.id} style={styles.memberItem}>
								<AvatarView name={member.username} avatarUrl={member.avatarUrl} size={42} />
								<View style={styles.memberBody}>
									<Text style={styles.memberName}>@{member.username}</Text>
									<Text style={styles.memberRole}>{member.role === 'host' ? 'Host' : 'Member'}</Text>
								</View>
							</View>
						))}
					</View>
				</View>

				{detail?.availableInviteFriends?.length ? (
					<View style={styles.card}>
						<Text style={styles.sectionTitle}>Mời thêm bạn bè</Text>
						<View style={styles.inviteWrap}>
							{detail.availableInviteFriends.map((friend) => {
								const selected = selectedInviteIds.includes(friend.id);
								return (
									<TouchableOpacity
										key={friend.id}
										style={[styles.inviteChip, selected && styles.inviteChipSelected]}
										onPress={() => toggleInvite(friend.id)}
									>
										<Text style={[styles.inviteChipText, selected && styles.inviteChipTextSelected]}>@{friend.username}</Text>
									</TouchableOpacity>
								);
							})}
						</View>
						<TouchableOpacity style={styles.secondaryActionButton} onPress={handleInviteMembers} disabled={inviting}>
							{inviting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.secondaryActionText}>Gửi lời mời</Text>}
						</TouchableOpacity>
					</View>
				) : null}

				<View style={styles.card}>
					<Text style={styles.sectionTitle}>Feed hoạt động</Text>
					{activeFeedGroup ? (
						<>
							<HorizontalScrollView
								horizontal
								showsHorizontalScrollIndicator={false}
								contentContainerStyle={styles.feedDateTabs}
							>
								{feedGroups.map((group) => {
									const selected = group.date === activeFeedGroup.date;
									return (
										<TouchableOpacity
											key={group.date}
											style={[styles.feedDateChip, selected && styles.feedDateChipActive]}
											onPress={() => setSelectedFeedDate(group.date)}
										>
											<Text style={[styles.feedDateChipText, selected && styles.feedDateChipTextActive]}>
												{group.label}
											</Text>
											<Text style={[styles.feedDateChipCount, selected && styles.feedDateChipTextActive]}>
												{group.items.length} bài đăng
											</Text>
										</TouchableOpacity>
									);
								})}
							</HorizontalScrollView>
							<Text style={styles.feedDateSummary}>
								Hiển thị minh chứng của {activeFeedGroup.label}.
							</Text>
							{activeFeedGroup.items.map((item) => (
								<View key={item.id} style={styles.feedCard}>
									<View style={styles.feedHeader}>
										<AvatarView name={item.user?.username} avatarUrl={item.user?.avatarUrl} size={38} />
										<View style={styles.feedMetaWrap}>
											<Text style={styles.feedUser}>@{item.user?.username}</Text>
											<Text style={styles.feedMeta}>{item.activity?.name || 'Hoạt động'} • {item.sessionDate}</Text>
										</View>
									</View>
									<MediaBlock item={item} />
									{item.caption ? <Text style={styles.feedCaption}>{item.caption}</Text> : null}
								</View>
							))}
						</>
					) : <Text style={styles.emptyText}>Chưa có ai đăng minh chứng.</Text>}
				</View>
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
	loaderWrap: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	content: {
		padding: 16,
		gap: 16,
	},
	heroCard: {
		backgroundColor: '#8B2500',
		borderRadius: 28,
		padding: 20,
		gap: 8,
	},
	heroTitle: {
		fontSize: 28,
		fontWeight: '800',
		color: '#FFFFFF',
	},
	heroSubtitle: {
		fontSize: 17,
		fontWeight: '700',
		color: '#FFDCCB',
	},
	heroMeta: {
		fontSize: 13,
		color: '#F8E8DF',
	},
	activityCard: {
		padding: 14,
		borderRadius: 18,
		backgroundColor: '#FFF8F4',
		gap: 8,
	},
	activityName: {
		fontSize: 16,
		fontWeight: '800',
		color: COLORS.textPrimary,
	},
	activityWindow: {
		fontSize: 13,
		lineHeight: 18,
		color: COLORS.textSecondary,
	},
	activityHint: {
		fontSize: 13,
		lineHeight: 18,
		color: COLORS.textSecondary,
	},
	uploadButton: {
		height: 46,
		borderRadius: 23,
		backgroundColor: COLORS.primary,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 4,
	},
	uploadButtonDisabled: {
		backgroundColor: '#CFB9AE',
	},
	uploadButtonText: {
		fontSize: 14,
		fontWeight: '800',
		color: '#FFFFFF',
	},
	leaveButton: {
		alignSelf: 'flex-start',
		marginTop: 8,
		paddingHorizontal: 14,
		paddingVertical: 10,
		borderRadius: 999,
		backgroundColor: 'rgba(255,255,255,0.18)',
	},
	leaveButtonText: {
		fontSize: 13,
		fontWeight: '700',
		color: '#FFFFFF',
	},
	card: {
		backgroundColor: '#FFFFFF',
		borderRadius: 24,
		padding: 16,
		gap: 12,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '800',
		color: COLORS.textPrimary,
	},
	membersWrap: {
		gap: 10,
	},
	memberItem: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	memberBody: {
		gap: 2,
	},
	memberName: {
		fontSize: 15,
		fontWeight: '700',
		color: COLORS.textPrimary,
	},
	memberRole: {
		fontSize: 13,
		color: COLORS.textSecondary,
	},
	inviteWrap: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 10,
	},
	inviteChip: {
		paddingHorizontal: 14,
		paddingVertical: 10,
		borderRadius: 999,
		backgroundColor: '#FFF2EA',
		borderWidth: 1,
		borderColor: '#E6C7B5',
	},
	inviteChipSelected: {
		backgroundColor: COLORS.primary,
		borderColor: COLORS.primary,
	},
	inviteChipText: {
		fontSize: 14,
		fontWeight: '700',
		color: COLORS.primary,
	},
	inviteChipTextSelected: {
		color: '#FFFFFF',
	},
	secondaryActionButton: {
		height: 46,
		borderRadius: 23,
		backgroundColor: COLORS.primary,
		alignItems: 'center',
		justifyContent: 'center',
	},
	secondaryActionText: {
		fontSize: 14,
		fontWeight: '800',
		color: '#FFFFFF',
	},
	sessionCard: {
		padding: 14,
		borderRadius: 18,
		backgroundColor: '#FFF6F1',
		gap: 8,
	},
	sessionTitle: {
		fontSize: 15,
		fontWeight: '800',
		color: COLORS.textPrimary,
	},
	sessionActivity: {
		fontSize: 14,
		fontWeight: '700',
		color: COLORS.primary,
	},
	sessionMeta: {
		fontSize: 13,
		color: COLORS.textSecondary,
	},
	sessionMembersWrap: {
		gap: 6,
	},
	sessionMemberLine: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		gap: 12,
	},
	sessionMemberName: {
		fontSize: 14,
		color: COLORS.textPrimary,
	},
	sessionStatus: {
		fontSize: 13,
		fontWeight: '700',
	},
	statusCompleted: {
		color: '#2E7D32',
	},
	statusMissed: {
		color: '#C62828',
	},
	statusUpcoming: {
		color: '#B26A00',
	},
	feedCard: {
		gap: 10,
		padding: 14,
		borderRadius: 18,
		backgroundColor: '#FFF8F4',
	},
	feedDateTabs: {
		gap: 10,
		paddingBottom: 4,
	},
	feedDateChip: {
		paddingHorizontal: 14,
		paddingVertical: 10,
		borderRadius: 18,
		backgroundColor: '#FFF4ED',
		borderWidth: 1,
		borderColor: '#EDD4C7',
		gap: 2,
	},
	feedDateChipActive: {
		backgroundColor: COLORS.primary,
		borderColor: COLORS.primary,
	},
	feedDateChipText: {
		fontSize: 13,
		fontWeight: '800',
		color: COLORS.textPrimary,
	},
	feedDateChipCount: {
		fontSize: 11,
		color: COLORS.textSecondary,
	},
	feedDateChipTextActive: {
		color: '#FFFFFF',
	},
	feedDateSummary: {
		fontSize: 13,
		lineHeight: 18,
		color: COLORS.textSecondary,
	},
	feedHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
	},
	feedMetaWrap: {
		gap: 2,
	},
	feedUser: {
		fontSize: 15,
		fontWeight: '800',
		color: COLORS.textPrimary,
	},
	feedMeta: {
		fontSize: 12,
		color: COLORS.textSecondary,
	},
	feedMedia: {
		width: '100%',
		height: 220,
		borderRadius: 18,
		backgroundColor: '#E8D7CD',
	},
	feedCaption: {
		fontSize: 14,
		lineHeight: 20,
		color: COLORS.textPrimary,
	},
	emptyText: {
		fontSize: 14,
		lineHeight: 20,
		color: COLORS.textSecondary,
	},
});