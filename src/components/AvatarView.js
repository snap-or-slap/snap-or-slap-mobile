import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/theme';

export default function AvatarView({ name, avatarUrl, size = 52 }) {
	const borderRadius = size / 2;
	const initial = (name || '?').trim().charAt(0).toUpperCase();

	if (avatarUrl) {
		return (
			<Image
				source={{ uri: avatarUrl }}
				style={[styles.image, { width: size, height: size, borderRadius }]}
			/>
		);
	}

	return (
		<View style={[styles.fallback, { width: size, height: size, borderRadius }]}>
			<Text style={[styles.initial, { fontSize: Math.max(18, size * 0.38) }]}>{initial}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	image: {
		backgroundColor: '#D9C1B5',
	},
	fallback: {
		backgroundColor: '#D9C1B5',
		alignItems: 'center',
		justifyContent: 'center',
	},
	initial: {
		fontWeight: '800',
		color: COLORS.primary,
	},
});