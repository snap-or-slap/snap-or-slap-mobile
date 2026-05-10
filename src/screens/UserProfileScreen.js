import React, { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AvatarView from '../components/AvatarView';
import { COLORS } from '../constants/theme';
import usersService from '../services/users.service';

function formatDate(value) {
	if (!value) return 'Unknown';
	return new Date(value).toLocaleDateString('vi-VN');
}

export default function UserProfileScreen({ navigation, route }) {
	const { userId } = route.params;
	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let mounted = true;

		usersService.getById(userId)
			.then((data) => {
				if (mounted) {
					setProfile(data);
				}
			})
			.finally(() => {
				if (mounted) {
					setLoading(false);
				}
			});

		return () => {
			mounted = false;
		};
	}, [userId]);

	return (
		<SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
			<View style={styles.header}>
				<TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
					<Text style={styles.backText}>Back</Text>
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Profile</Text>
				<View style={styles.backBtn} />
			</View>

			{loading ? (
				<View style={styles.loaderWrap}>
					<ActivityIndicator size="large" color={COLORS.primary} />
				</View>
			) : (
				<ScrollView contentContainerStyle={styles.content}>
					<AvatarView
						name={profile?.username}
						avatarUrl={profile?.avatarUrl}
						size={112}
					/>
					<Text style={styles.name}>{profile?.username}</Text>
					<Text style={styles.handle}>@{profile?.username}</Text>
					<View style={styles.card}>
						<Text style={styles.cardLabel}>Email</Text>
						<Text style={styles.cardValue}>{profile?.email}</Text>
					</View>
					<View style={styles.card}>
						<Text style={styles.cardLabel}>Joined</Text>
						<Text style={styles.cardValue}>{formatDate(profile?.createdAt)}</Text>
					</View>
				</ScrollView>
			)}
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
	backBtn: {
		width: 52,
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
	loaderWrap: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	content: {
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingVertical: 28,
		gap: 14,
	},
	name: {
		fontSize: 28,
		fontWeight: '800',
		color: COLORS.primary,
	},
	handle: {
		fontSize: 15,
		color: COLORS.textSecondary,
		marginTop: -8,
		marginBottom: 10,
	},
	card: {
		width: '100%',
		backgroundColor: '#F7EAE3',
		borderRadius: 22,
		padding: 18,
		gap: 6,
	},
	cardLabel: {
		fontSize: 13,
		fontWeight: '700',
		color: COLORS.textSecondary,
	},
	cardValue: {
		fontSize: 16,
		color: COLORS.textPrimary,
	},
});