import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Alert,
	TextInput,
	ScrollView,
	ActivityIndicator,
	RefreshControl,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import AvatarView from '../components/AvatarView';
import ChallengesTab from '../components/ChallengesTab';
import { COLORS, SIZES } from '../constants/theme';
import authService from '../services/auth.service';
import challengeSocketService from '../services/challenge-socket.service';
import friendsService from '../services/friends.service';
import { showRealtimeChallengeNotification } from '../services/challenge-notifications.service';
import usersService from '../services/users.service';

function TabItem({ label, icon, active, onPress }) {
	return (
		<TouchableOpacity style={styles.tabItem} onPress={onPress} activeOpacity={0.7}>
			<Text style={[styles.tabIcon, active && styles.tabIconActive]}>{icon}</Text>
			<Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
			{active && <View style={styles.tabIndicator} />}
		</TouchableOpacity>
	);
}

export default function HomeScreen({ navigation }) {
	const [activeTab, setActiveTab] = useState('Friends');
	const [overview, setOverview] = useState({
		pendingReceived: [],
		pendingSent: [],
		friends: [],
	});
	const [requestUsername, setRequestUsername] = useState('');
	const [loadingOverview, setLoadingOverview] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [submittingRequest, setSubmittingRequest] = useState(false);
	const [actionId, setActionId] = useState(null);
	const [currentUser, setCurrentUser] = useState(null);
	const [loadingProfile, setLoadingProfile] = useState(false);
	const [updatingAvatar, setUpdatingAvatar] = useState(false);
	const [challengeUnreadCount, setChallengeUnreadCount] = useState(0);

	useEffect(() => {
		loadCurrentUser();
	}, []);

	useEffect(() => {
		let unsubNotification = null;
		let mounted = true;

		(async () => {
			unsubNotification = await challengeSocketService.subscribe('challenge.notification', async (payload) => {
				if (!mounted || !payload?.notification) {
					return;
				}

				await showRealtimeChallengeNotification(payload.notification);
			});
		})();

		return () => {
			mounted = false;
			unsubNotification?.();
		};
	}, []);

	useEffect(() => {
		if (activeTab === 'Friends') {
			loadOverview();
		}
	}, [activeTab]);

	const loadOverview = async (showRefresh = false) => {
		try {
			if (showRefresh) {
				setRefreshing(true);
			} else {
				setLoadingOverview(true);
			}
			const data = await friendsService.getOverview();
			setOverview(data);
		} catch (err) {
			Alert.alert('Không tải được danh sách bạn bè', err.message || 'Có lỗi xảy ra');
		} finally {
			setLoadingOverview(false);
			setRefreshing(false);
		}
	};

	const loadCurrentUser = async () => {
		try {
			setLoadingProfile(true);
			const me = await usersService.getMe();
			setCurrentUser(me);
			await authService.saveUser(me);
		} catch {
			const cachedUser = await authService.getUser();
			setCurrentUser(cachedUser);
		} finally {
			setLoadingProfile(false);
		}
	};

	const handleSendRequest = async () => {
		const username = requestUsername.trim().toLowerCase();
		if (!username) {
			Alert.alert('Thiếu username', 'Vui lòng nhập username để gửi lời mời');
			return;
		}

		try {
			setSubmittingRequest(true);
			await friendsService.sendRequest(username);
			setRequestUsername('');
			await loadOverview();
			Alert.alert('Thành công', 'Đã gửi lời mời kết bạn');
		} catch (err) {
			Alert.alert('Không gửi được lời mời', err.message || 'Có lỗi xảy ra');
		} finally {
			setSubmittingRequest(false);
		}
	};

	const handleAccept = async (requestId) => {
		try {
			setActionId(requestId);
			await friendsService.acceptRequest(requestId);
			await loadOverview();
		} catch (err) {
			Alert.alert('Không thể chấp nhận', err.message || 'Có lỗi xảy ra');
		} finally {
			setActionId(null);
		}
	};

	const handleDecline = async (requestId) => {
		try {
			setActionId(requestId);
			await friendsService.declineRequest(requestId);
			await loadOverview();
		} catch (err) {
			Alert.alert('Không thể từ chối', err.message || 'Có lỗi xảy ra');
		} finally {
			setActionId(null);
		}
	};

	const handleRemoveFriend = (friend) => {
		Alert.alert('Xoá bạn', `Xoá ${friend.username} khỏi danh sách bạn bè?`, [
			{ text: 'Huỷ', style: 'cancel' },
			{
				text: 'Xoá',
				style: 'destructive',
				onPress: async () => {
					try {
						setActionId(friend.id);
						await friendsService.removeFriend(friend.id);
						await loadOverview();
					} catch (err) {
						Alert.alert('Không thể xoá bạn', err.message || 'Có lỗi xảy ra');
					} finally {
						setActionId(null);
					}
				},
			},
		]);
	};

	const handleLogout = () => {
		Alert.alert('Đăng xuất', 'Bạn chắc chắn muốn đăng xuất?', [
			{ text: 'Huỷ', style: 'cancel' },
			{
				text: 'Đăng xuất',
				style: 'destructive',
				onPress: async () => {
					await authService.logout();
					navigation.replace('SignIn');
				},
			},
		]);
	};

	const openUserProfile = (userId) => {
		navigation.navigate('UserProfile', { userId });
	};

	const handleChangeAvatar = async () => {
		try {
			const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
			if (!permission.granted) {
				Alert.alert('Thiếu quyền truy cập', 'Hãy cho phép app truy cập thư viện ảnh');
				return;
			}

			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [1, 1],
				quality: 0.6,
				base64: true,
			});

			if (result.canceled || !result.assets?.length) {
				return;
			}

			const asset = result.assets[0];
			if (!asset.base64) {
				Alert.alert('Không thể đọc ảnh', 'Hãy thử chọn ảnh khác');
				return;
			}

			const mimeType = asset.mimeType || 'image/jpeg';
			const avatarUrl = `data:${mimeType};base64,${asset.base64}`;

			setUpdatingAvatar(true);
			const updated = await usersService.updateMe({ avatarUrl });
			setCurrentUser(updated);
			await authService.saveUser(updated);
		} catch (err) {
			Alert.alert('Không đổi được avatar', err.message || 'Có lỗi xảy ra');
		} finally {
			setUpdatingAvatar(false);
		}
	};

	const renderRequestCard = (item) => (
		<View key={item.id} style={styles.requestCard}>
			<TouchableOpacity onPress={() => openUserProfile(item.user.id)} activeOpacity={0.8}>
				<AvatarView name={item.user.username} avatarUrl={item.user.avatarUrl} size={44} />
			</TouchableOpacity>
			<View style={styles.requestBody}>
				<Text style={styles.requestName}>{item.user.username}</Text>
				<Text style={styles.requestMeta}>{item.user.email}</Text>
			</View>
			{item.direction === 'incoming' ? (
				<View style={styles.requestActions}>
					<TouchableOpacity
						style={styles.secondaryPillBtn}
						onPress={() => handleDecline(item.id)}
						disabled={actionId === item.id}
					>
						<Text style={styles.secondaryPillText}>Decline</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.primaryPillBtn}
						onPress={() => handleAccept(item.id)}
						disabled={actionId === item.id}
					>
						{actionId === item.id ? (
							<ActivityIndicator color="#FFFFFF" />
						) : (
							<Text style={styles.primaryPillText}>Accept</Text>
						)}
					</TouchableOpacity>
				</View>
			) : (
				<View style={styles.pendingBadge}>
					<Text style={styles.pendingBadgeText}>Pending</Text>
				</View>
			)}
		</View>
	);

	const renderFriendCard = (friend) => (
		<View key={friend.id} style={styles.friendCard}>
			<View style={styles.friendLeft}>
				<TouchableOpacity onPress={() => openUserProfile(friend.id)} activeOpacity={0.8}>
					<AvatarView name={friend.username} avatarUrl={friend.avatarUrl} size={52} />
				</TouchableOpacity>
				<View>
					<Text style={styles.friendName}>{friend.username}</Text>
					<Text style={styles.friendHandle}>@{friend.username}</Text>
				</View>
			</View>
			<TouchableOpacity
				style={styles.fireBadge}
				onPress={() => handleRemoveFriend(friend)}
				disabled={actionId === friend.id}
			>
				{actionId === friend.id ? (
					<ActivityIndicator color={COLORS.primary} size="small" />
				) : (
					<>
						<Text style={styles.fireIcon}>🔥</Text>
						<Text style={styles.fireText}>Remove</Text>
					</>
				)}
			</TouchableOpacity>
		</View>
	);

	const renderFriendsTab = () => {
		if (loadingOverview) {
			return (
				<View style={styles.loadingWrap}>
					<ActivityIndicator size="large" color={COLORS.primary} />
				</View>
			);
		}

		return (
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={() => loadOverview(true)}
						tintColor={COLORS.primary}
					/>
				}
			>
				<View style={styles.searchRow}>
					<TextInput
						style={styles.searchInput}
						placeholder="Nhập username để kết bạn"
						placeholderTextColor={COLORS.textMuted}
						value={requestUsername}
						onChangeText={setRequestUsername}
						autoCapitalize="none"
						autoCorrect={false}
					/>
					<TouchableOpacity
						style={styles.addBtn}
						onPress={handleSendRequest}
						disabled={submittingRequest}
					>
						{submittingRequest ? (
							<ActivityIndicator color="#FFFFFF" />
						) : (
							<Text style={styles.addBtnText}>Add</Text>
						)}
					</TouchableOpacity>
				</View>

				<View style={styles.sectionHeader}>
					<View>
						<Text style={styles.sectionTitle}>Friend Requests</Text>
						<Text style={styles.sectionSubtitle}>New connections waiting</Text>
					</View>
					<Text style={styles.sectionCount}>{overview.pendingReceived.length}</Text>
				</View>

				{overview.pendingReceived.length > 0 ? (
					<View style={styles.requestList}>
						{overview.pendingReceived.map(renderRequestCard)}
					</View>
				) : (
					<Text style={styles.emptyText}>Chưa có lời mời nào.</Text>
				)}

				{overview.pendingSent.length > 0 ? (
					<>
						<View style={styles.sectionHeaderSecondary}>
							<Text style={styles.sectionTitle}>Sent Requests</Text>
						</View>
						<View style={styles.requestList}>
							{overview.pendingSent.map(renderRequestCard)}
						</View>
					</>
				) : null}

				<View style={styles.sectionHeaderSecondary}>
					<Text style={styles.sectionTitle}>Friends</Text>
					<Text style={styles.sectionCount}>{overview.friends.length}</Text>
				</View>

				{overview.friends.length > 0 ? (
					<View style={styles.friendsList}>
						{overview.friends.map(renderFriendCard)}
					</View>
				) : (
					<Text style={styles.emptyText}>
						Chưa có bạn bè. Gửi lời mời bằng username để bắt đầu.
					</Text>
				)}

				{currentUser ? (
					<Text style={styles.helperText}>
						Bạn đang đăng nhập với username @{currentUser.username}
					</Text>
				) : null}
			</ScrollView>
		);
	};

	const renderProfileTab = () => {
		if (loadingProfile && !currentUser) {
			return (
				<View style={styles.loadingWrap}>
					<ActivityIndicator size="large" color={COLORS.primary} />
				</View>
			);
		}

		return (
			<ScrollView contentContainerStyle={styles.profileContent}>
				<TouchableOpacity
					style={styles.profileAvatarWrap}
					onPress={handleChangeAvatar}
					activeOpacity={0.85}
				>
					<AvatarView
						name={currentUser?.username}
						avatarUrl={currentUser?.avatarUrl}
						size={118}
					/>
					<View style={styles.cameraBadge}>
						<Text style={styles.cameraBadgeText}>📷</Text>
					</View>
				</TouchableOpacity>
				<Text style={styles.profileName}>{currentUser?.username}</Text>
				<Text style={styles.profileHandle}>@{currentUser?.username}</Text>

				<TouchableOpacity
					style={styles.changeAvatarBtn}
					onPress={handleChangeAvatar}
					disabled={updatingAvatar}
				>
					{updatingAvatar ? (
						<ActivityIndicator color="#FFFFFF" />
					) : (
						<Text style={styles.changeAvatarText}>Đổi avatar</Text>
					)}
				</TouchableOpacity>

				<View style={styles.profileCard}>
					<Text style={styles.profileCardLabel}>Email</Text>
					<Text style={styles.profileCardValue}>{currentUser?.email}</Text>
				</View>

				<TouchableOpacity
					style={styles.createChallengeBtn}
					onPress={() =>
						navigation.navigate('ChallengeCreate', { friends: overview.friends || [] })
					}
				>
					<Text style={styles.createChallengeBtnText}>Create challenge</Text>
				</TouchableOpacity>
			</ScrollView>
		);
	};

	return (
		<SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
			<View style={styles.header}>
				<TouchableOpacity style={styles.headerIcon} activeOpacity={1}>
					<Text style={styles.headerIconText}>🔔</Text>
					{challengeUnreadCount > 0 ? <View style={styles.notifDot} /> : null}
				</TouchableOpacity>
				<Text style={styles.headerTitle}>{activeTab}</Text>
				<TouchableOpacity style={styles.headerIcon} onPress={handleLogout}>
					<Text style={styles.headerIconText}>🚪</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.body}>
				{activeTab === 'Friends' ? renderFriendsTab() : null}
				{activeTab === 'Challenges' ? (
					<ChallengesTab
						navigation={navigation}
						friends={overview.friends}
						currentUser={currentUser}
						onUnreadChange={setChallengeUnreadCount}
					/>
				) : null}
				{activeTab === 'Profile' ? renderProfileTab() : null}
			</View>

			<View style={styles.tabBar}>
				<TabItem
					label="Friends"
					icon="👥"
					active={activeTab === 'Friends'}
					onPress={() => setActiveTab('Friends')}
				/>
				<TabItem
					label="Challenges"
					icon="🏆"
					active={activeTab === 'Challenges'}
					onPress={() => setActiveTab('Challenges')}
				/>
				<TabItem
					label="Profile"
					icon="👤"
					active={activeTab === 'Profile'}
					onPress={() => setActiveTab('Profile')}
				/>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#FDF5F0',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingVertical: 14,
		backgroundColor: '#FDF5F0',
		borderBottomWidth: 1,
		borderBottomColor: '#F0E0D8',
	},
	headerTitle: {
		flex: 1,
		textAlign: 'center',
		fontSize: 20,
		fontWeight: '800',
		color: COLORS.primary,
	},
	headerIcon: {
		width: 36,
		height: 36,
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative',
	},
	headerIconText: {
		fontSize: 20,
	},
	notifDot: {
		position: 'absolute',
		top: 2,
		right: 2,
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: '#E53935',
	},
	body: {
		flex: 1,
	},
	placeholderWrap: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		gap: 12,
	},
	loadingWrap: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	scrollContent: {
		paddingHorizontal: 16,
		paddingBottom: 24,
		gap: 16,
	},
	searchRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
		paddingTop: 12,
	},
	searchInput: {
		flex: 1,
		height: SIZES.inputHeight,
		backgroundColor: '#FFFFFF',
		borderRadius: 20,
		paddingHorizontal: 16,
		borderWidth: 1,
		borderColor: '#ECDDD4',
		color: COLORS.textPrimary,
	},
	addBtn: {
		height: SIZES.inputHeight,
		minWidth: 82,
		paddingHorizontal: 18,
		borderRadius: 20,
		backgroundColor: COLORS.primary,
		alignItems: 'center',
		justifyContent: 'center',
	},
	addBtnText: {
		color: '#FFFFFF',
		fontSize: 15,
		fontWeight: '700',
	},
	sectionHeader: {
		marginTop: 8,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
	},
	sectionHeaderSecondary: {
		marginTop: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: '800',
		color: COLORS.textPrimary,
	},
	sectionSubtitle: {
		fontSize: 13,
		color: COLORS.textSecondary,
		marginTop: 2,
	},
	sectionCount: {
		fontSize: 14,
		fontWeight: '700',
		color: COLORS.primary,
	},
	requestList: {
		gap: 12,
	},
	requestCard: {
		backgroundColor: '#F7EAE3',
		borderRadius: 22,
		padding: 14,
		gap: 12,
	},
	requestBody: {
		gap: 2,
	},
	requestName: {
		fontSize: 18,
		fontWeight: '800',
		color: COLORS.textPrimary,
	},
	requestMeta: {
		fontSize: 13,
		color: COLORS.textSecondary,
	},
	requestActions: {
		flexDirection: 'row',
		gap: 10,
	},
	secondaryPillBtn: {
		flex: 1,
		height: 42,
		borderRadius: 21,
		backgroundColor: '#FFFFFF',
		alignItems: 'center',
		justifyContent: 'center',
	},
	secondaryPillText: {
		color: COLORS.primary,
		fontWeight: '700',
	},
	primaryPillBtn: {
		flex: 1,
		height: 42,
		borderRadius: 21,
		backgroundColor: COLORS.primary,
		alignItems: 'center',
		justifyContent: 'center',
	},
	primaryPillText: {
		color: '#FFFFFF',
		fontWeight: '700',
	},
	pendingBadge: {
		alignSelf: 'flex-start',
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 999,
		backgroundColor: '#FFFFFF',
	},
	pendingBadgeText: {
		color: COLORS.primary,
		fontWeight: '700',
	},
	friendsList: {
		gap: 12,
	},
	friendCard: {
		backgroundColor: '#F7EAE3',
		borderRadius: 22,
		padding: 14,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 12,
	},
	friendLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		flex: 1,
	},
	friendName: {
		fontSize: 18,
		fontWeight: '800',
		color: COLORS.primary,
	},
	friendHandle: {
		fontSize: 14,
		color: COLORS.textSecondary,
		marginTop: 2,
	},
	fireBadge: {
		minWidth: 94,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#FFFFFF',
		paddingHorizontal: 12,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 6,
	},
	fireIcon: {
		fontSize: 15,
	},
	fireText: {
		color: COLORS.primary,
		fontWeight: '700',
	},
	emptyText: {
		fontSize: 14,
		color: COLORS.textSecondary,
	},
	helperText: {
		fontSize: 13,
		color: COLORS.textSecondary,
		textAlign: 'center',
		marginTop: 8,
	},
	profileContent: {
		paddingHorizontal: 20,
		paddingVertical: 24,
		alignItems: 'center',
		gap: 14,
	},
	profileAvatarWrap: {
		position: 'relative',
		marginTop: 6,
	},
	cameraBadge: {
		position: 'absolute',
		right: 0,
		bottom: 0,
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: COLORS.primary,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 3,
		borderColor: COLORS.background,
	},
	cameraBadgeText: {
		fontSize: 16,
	},
	profileName: {
		fontSize: 28,
		fontWeight: '800',
		color: COLORS.primary,
	},
	profileHandle: {
		fontSize: 15,
		color: COLORS.textSecondary,
		marginTop: -6,
	},
	changeAvatarBtn: {
		width: '100%',
		height: 48,
		borderRadius: 24,
		backgroundColor: COLORS.primary,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 6,
	},
	changeAvatarText: {
		color: '#FFFFFF',
		fontSize: 15,
		fontWeight: '700',
	},
	profileCard: {
		width: '100%',
		backgroundColor: '#F7EAE3',
		borderRadius: 22,
		padding: 18,
		gap: 6,
	},
	profileCardLabel: {
		fontSize: 13,
		fontWeight: '700',
		color: COLORS.textSecondary,
	},
	profileCardValue: {
		fontSize: 16,
		color: COLORS.textPrimary,
	},
	placeholderText: {
		fontSize: 20,
		fontWeight: '700',
		color: COLORS.textSecondary,
	},
	placeholderSub: {
		fontSize: 16,
		color: COLORS.textMuted,
	},
	createChallengeBtn: {
		width: '100%',
		height: 48,
		borderRadius: 24,
		backgroundColor: '#FFF0E8',
		borderWidth: 1,
		borderColor: '#E7C5B1',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 8,
	},
	createChallengeBtnText: {
		fontSize: 15,
		fontWeight: '700',
		color: COLORS.primary,
	},
	tabBar: {
		flexDirection: 'row',
		borderTopWidth: 1,
		borderTopColor: '#F0E0D8',
		backgroundColor: '#FFFFFF',
		paddingBottom: 4,
	},
	tabItem: {
		flex: 1,
		alignItems: 'center',
		paddingVertical: 10,
		position: 'relative',
	},
	tabIcon: {
		fontSize: 22,
		opacity: 0.4,
	},
	tabIconActive: {
		opacity: 1,
	},
	tabLabel: {
		fontSize: 11,
		color: COLORS.textSecondary,
		marginTop: 2,
	},
	tabLabelActive: {
		color: COLORS.primary,
		fontWeight: '700',
	},
	tabIndicator: {
		position: 'absolute',
		top: 0,
		left: '25%',
		right: '25%',
		height: 3,
		backgroundColor: COLORS.primary,
		borderBottomLeftRadius: 3,
		borderBottomRightRadius: 3,
	},
});
