import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '../constants/theme';

const { width } = Dimensions.get('window');

export default function WaveHeader({ title, onBack }) {
	return (
		<View style={styles.container}>
			<View style={styles.topBar}>
				{onBack && (
					<TouchableOpacity onPress={onBack} style={styles.backBtn}>
						<Text style={styles.backIcon}>{'←'}</Text>
					</TouchableOpacity>
				)}
				<Text style={styles.title}>{title}</Text>
			</View>
			<Svg
				width={width}
				height={100}
				viewBox={`0 0 ${width} 100`}
				style={styles.wave}
			>
				<Path
					d={`M0,0 L${width},0 L${width},40 Q${width * 0.75},100 ${width * 0.5},60 Q${width * 0.25},20 0,70 Z`}
					fill={COLORS.primary}
				/>
			</Svg>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: COLORS.waveTop,
		paddingTop: 50,
	},
	topBar: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingBottom: 8,
	},
	backBtn: {
		marginRight: 12,
		padding: 4,
	},
	backIcon: {
		fontSize: 22,
		color: COLORS.primary,
		fontWeight: '600',
	},
	title: {
		fontSize: 26,
		fontWeight: '700',
		color: COLORS.primary,
	},
	wave: {
		display: 'flex',
	},
});
