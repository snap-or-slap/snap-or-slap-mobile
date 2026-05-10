import React, { useCallback, useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	RefreshControl,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AvatarView from './AvatarView';
import { COLORS } from '../constants/theme';
import { syncChallengeReminders } from '../services/challenge-notifications.service';
import challengeSocketService from '../services/challenge-socket.service';
import challengesService from '../services/challenges.service';

function SectionHeader({ title, count, actionLabel, onActionPress }) {
	return (
		<View style={styles.sectionHeader}>
			<View>
				<Text style={styles.sectionTitle}>{title}</Text>
				{typeof count === 'number' ? <Text style={styles.sectionCount}>{count}</Text> : null}
			</View>
			{actionLabel ? (
				<TouchableOpacity onPress={onActionPress}>
					<Text style={styles.sectionAction}>{actionLabel}</Text>
				</TouchableOpacity>
			) : null}
		</View>
	);
}

export default function ChallengesTab({ navigation, friends = [], onUnreadChange }) {
	const [overview, setOverview] = useState({
		challenges: [],
		invites: [],
		notifications: [],
		unreadNotificationCount: 0,
	});
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [actionId, setActionId] = useState(null);

	const loadOverview = useCallback(async (showRefresh = false, syncReminders = true) => {
		try {
			if (showRefresh) {
				setRefreshing(true);
			} else {
				setLoading(true);
			}

			const data = await challengesService.getOverview();
			setOverview(data);
			onUnreadChange?.(data.unreadNotificationCount || 0);
			if (syncReminders) {
				await syncChallengeReminders(data.challenges || []);
			}
		} catch (error) {
			Alert.alert('Không tải được challenge', error.message || 'Có lỗi xảy ra');
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, [onUnreadChange]);

	useFocusEffect(
		useCallback(() => {
			loadOverview(false, true);
		}, [loadOverview]),
	);

	useEffect(() => {
		let unsubNotification = null;
		let unsubUpdate = null;
		let mounted = true;

		(async () => {
			unsubNotification = await challengeSocketService.subscribe('challenge.notification', () => {
				if (mounted) {
					loadOverview(true, false);
				}
			});
			unsubUpdate = await challengeSocketService.subscribe('challenge.updated', () => {
				if (mounted) {
					loadOverview(true, false);
				}
			});
		})();

		return () => {
			mounted = false;
			unsubNotification?.();
			unsubUpdate?.();
		};
	}, [loadOverview]);

	const handleInviteResponse = async (inviteId, shouldAccept) => {
		try {
			setActionId(inviteId);
			if (shouldAccept) {
				await challengesService.acceptInvite(inviteId);
			} else {
				await challengesService.declineInvite(inviteId);
			}
			await loadOverview(true, shouldAccept);
		} catch (error) {
			Alert.alert('Không xử lý được lời mời', error.message || 'Có lỗi xảy ra');
		} finally {
			setActionId(null);
		}
	};

	const openCreate = () => {
		navigation.navigate('ChallengeCreate', { friends });
	};

	const openDetail = (challengeId) => {
		navigation.navigate('ChallengeDetail', { challengeId });
	};

	const markNotificationsRead = async () => {
		try {
			await challengesService.markNotificationsRead();
			await loadOverview(true, false);
		} catch (error) {
			Alert.alert('Không đánh dấu được thông báo', error.message || 'Có lỗi xảy ra');
		}
	};

	if (loading) {
		return (
			<View style={styles.loaderWrap}>
				<ActivityIndicator size="large" color={COLORS.primary} />
			</View>
		);
	}

	return (
		<ScrollView
			contentContainerStyle={styles.container}
			refreshControl={
				<RefreshControl
					refreshing={refreshing}
					onRefresh={() => loadOverview(true, true)}
					tintColor={COLORS.primary}
				/>
			}
		>
			<TouchableOpacity style={styles.createCard} onPress={openCreate}>
				<Text style={styles.createEyebrow}>Host control</Text>
				<Text style={styles.createTitle}>Create challenge</Text>
				<Text style={styles.createDescription}>
					Tạo thử thách, thêm tối đa 5 hoạt động mỗi ngày, gắn nhiều khung giờ cho từng hoạt động và mời bạn bè tham gia.
				</Text>
			</TouchableOpacity>

			<SectionHeader title="Lời mời đang chờ" count={overview.invites.length} />
			{overview.invites.length > 0 ? overview.invites.map((invite) => (
				<View key={invite.id} style={styles.inviteCard}>
					<Text style={styles.inviteTitle}>{invite.challenge?.name}</Text>
					<Text style={styles.inviteMeta}>{invite.challenge?.activityCount || 0} hoạt động mỗi ngày</Text>
					<Text style={styles.inviteMeta}>{invite.challenge?.activities?.map((item) => item.name).join(', ')}</Text>
					<Text style={styles.inviteMeta}>Mời bởi @{invite.inviter.username}</Text>
					<View style={styles.actionRow}>
						<TouchableOpacity
							style={styles.secondaryButton}
							onPress={() => handleInviteResponse(invite.id, false)}
							disabled={actionId === invite.id}
						>
							<Text style={styles.secondaryButtonText}>Từ chối</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.primaryButton}
							onPress={() => handleInviteResponse(invite.id, true)}
							disabled={actionId === invite.id}
						>
							{actionId === invite.id ? (
								<ActivityIndicator color="#FFFFFF" />
							) : (
								<Text style={styles.primaryButtonText}>Tham gia</Text>
							)}
						</TouchableOpacity>
					</View>
				</View>
			)) : <Text style={styles.emptyText}>Chưa có lời mời challenge mới.</Text>}

			<SectionHeader title="Challenge của bạn" count={overview.challenges.length} />
			{overview.challenges.length > 0 ? overview.challenges.map((challenge) => (
				<TouchableOpacity
					key={challenge.id}
					style={styles.challengeCard}
					onPress={() => openDetail(challenge.id)}
				>
					<View style={styles.challengeTop}>
						<View>
							<Text style={styles.challengeName}>{challenge.name}</Text>
							<Text style={styles.challengeActivity}>{challenge.activityCount} hoạt động mỗi ngày</Text>
						</View>
						<View style={styles.countBadge}>
							<Text style={styles.countBadgeText}>{challenge.memberCount}/7</Text>
						</View>
					</View>
					<Text style={styles.challengeMeta}>{challenge.nextSessionLabel}</Text>
					<Text style={styles.challengeMeta}>{challenge.activities?.map((item) => item.name).join(', ')}</Text>
					<Text style={styles.challengeMeta}>{challenge.startsOn} đến {challenge.endsOn}</Text>
					<Text style={styles.challengeMeta}>
						{challenge.isHost ? 'Bạn là host' : `Host: @${challenge.host.username}`}
					</Text>
				</TouchableOpacity>
			)) : <Text style={styles.emptyText}>Bạn chưa tham gia challenge nào.</Text>}

			<SectionHeader
				title="Thông báo challenge"
				count={overview.unreadNotificationCount}
				actionLabel={overview.notifications.length ? 'Đánh dấu đã đọc' : null}
				onActionPress={markNotificationsRead}
			/>
			{overview.notifications.length > 0 ? overview.notifications.map((notification) => (
				<View key={notification.id} style={[styles.notificationCard, !notification.isRead && styles.notificationCardUnread]}>
					<Text style={styles.notificationTitle}>{notification.title}</Text>
					<Text style={styles.notificationBody}>{notification.body}</Text>
				</View>
			)) : <Text style={styles.emptyText}>Chưa có thông báo challenge.</Text>}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 16,
		paddingVertical: 16,
		gap: 16,
	},
	loaderWrap: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	createCard: {
		backgroundColor: '#8B2500',
		borderRadius: 26,
		padding: 20,
		gap: 6,
	},
	createEyebrow: {
		fontSize: 12,
		fontWeight: '700',
		textTransform: 'uppercase',
		letterSpacing: 1,
		color: '#F7CFBA',
	},
	createTitle: {
		fontSize: 24,
		fontWeight: '800',
		color: '#FFFFFF',
	},
	createDescription: {
		fontSize: 14,
		lineHeight: 20,
		color: '#F8E8DF',
	},
	sectionHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	sectionTitle: {
		fontSize: 17,
		fontWeight: '800',
		color: COLORS.textPrimary,
	},
	sectionCount: {
		fontSize: 13,
		color: COLORS.textSecondary,
		marginTop: 2,
	},
	sectionAction: {
		fontSize: 13,
		fontWeight: '700',
		color: COLORS.primary,
	},
	inviteCard: {
		backgroundColor: '#FFF1E8',
		borderRadius: 22,
		padding: 16,
		gap: 6,
	},
	inviteTitle: {
		fontSize: 18,
		fontWeight: '800',
		color: COLORS.primary,
	},
	inviteMeta: {
		fontSize: 13,
		color: COLORS.textSecondary,
	},
	actionRow: {
		flexDirection: 'row',
		gap: 10,
		marginTop: 10,
	},
	secondaryButton: {
		flex: 1,
		height: 44,
		borderRadius: 22,
		backgroundColor: '#FFFFFF',
		alignItems: 'center',
		justifyContent: 'center',
	},
	secondaryButtonText: {
		fontSize: 14,
		fontWeight: '700',
		color: COLORS.primary,
	},
	primaryButton: {
		flex: 1,
		height: 44,
		borderRadius: 22,
		backgroundColor: COLORS.primary,
		alignItems: 'center',
		justifyContent: 'center',
	},
	primaryButtonText: {
		fontSize: 14,
		fontWeight: '700',
		color: '#FFFFFF',
	},
	challengeCard: {
		backgroundColor: '#FFFFFF',
		borderRadius: 22,
		padding: 16,
		borderWidth: 1,
		borderColor: '#F0E0D8',
		gap: 6,
	},
	challengeTop: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		gap: 12,
	},
	challengeName: {
		fontSize: 18,
		fontWeight: '800',
		color: COLORS.textPrimary,
	},
	challengeActivity: {
		fontSize: 15,
		fontWeight: '700',
		color: COLORS.primary,
		marginTop: 2,
	},
	challengeMeta: {
		fontSize: 13,
		color: COLORS.textSecondary,
	},
	countBadge: {
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 999,
		backgroundColor: '#F9E4D7',
		alignSelf: 'flex-start',
	},
	countBadgeText: {
		fontSize: 13,
		fontWeight: '700',
		color: COLORS.primary,
	},
	notificationCard: {
		backgroundColor: '#FFF7F2',
		borderRadius: 18,
		padding: 14,
		gap: 4,
	},
	notificationCardUnread: {
		borderWidth: 1,
		borderColor: '#E3B69C',
	},
	notificationTitle: {
		fontSize: 15,
		fontWeight: '800',
		color: COLORS.textPrimary,
	},
	notificationBody: {
		fontSize: 13,
		lineHeight: 18,
		color: COLORS.textSecondary,
	},
	emptyText: {
		fontSize: 14,
		lineHeight: 20,
		color: COLORS.textSecondary,
	},
});