import React, { useState } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
	Alert,
	ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WaveHeader from '../components/WaveHeader';
import { COLORS, SIZES } from '../constants/theme';
import authService from '../services/auth.service';

export default function SignInScreen({ navigation }) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleLogin = async () => {
		if (!email || !password) {
			Alert.alert('Lỗi', 'Vui lòng nhập email và mật khẩu');
			return;
		}
		try {
			setLoading(true);
			await authService.login({ email: email.trim().toLowerCase(), password });
			navigation.replace('Home');
		} catch (err) {
			Alert.alert('Đăng nhập thất bại', err.message || 'Có lỗi xảy ra');
		} finally {
			setLoading(false);
		}
	};

	return (
		<SafeAreaView style={styles.safeArea} edges={['bottom']}>
			<ScrollView
				style={styles.scroll}
				keyboardShouldPersistTaps="handled"
				showsVerticalScrollIndicator={false}
			>
				<WaveHeader title="Log in" />

				<View style={styles.form}>
					{/* Email */}
					<View style={styles.fieldGroup}>
						<Text style={styles.label}>
							Email <Text style={styles.required}>*</Text>
						</Text>
						<TextInput
							style={styles.input}
							placeholder="phuc@example.com"
							placeholderTextColor={COLORS.textMuted}
							value={email}
							onChangeText={setEmail}
							keyboardType="email-address"
							autoCapitalize="none"
							autoCorrect={false}
						/>
					</View>

					{/* Password */}
					<View style={styles.fieldGroup}>
						<Text style={styles.label}>
							Password <Text style={styles.required}>*</Text>
						</Text>
						<View style={styles.inputRow}>
							<TextInput
								style={[styles.input, styles.inputFlex]}
								placeholder="••••••••••"
								placeholderTextColor={COLORS.textMuted}
								value={password}
								onChangeText={setPassword}
								secureTextEntry={!showPassword}
								autoCapitalize="none"
							/>
							<TouchableOpacity
								style={styles.eyeBtn}
								onPress={() => setShowPassword(!showPassword)}
							>
								<Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁'}</Text>
							</TouchableOpacity>
						</View>
						<TouchableOpacity style={styles.forgotRow}>
							<Text style={styles.forgotText}>Forgot password?</Text>
						</TouchableOpacity>
					</View>

					{/* Login Button */}
					<TouchableOpacity style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]} onPress={handleLogin} activeOpacity={0.85} disabled={loading}>
						{loading
							? <ActivityIndicator color="#fff" />
							: <Text style={styles.primaryBtnText}>Log in</Text>
						}
					</TouchableOpacity>

					{/* Divider */}
					<View style={styles.dividerRow}>
						<View style={styles.dividerLine} />
						<Text style={styles.dividerText}>Or continue with</Text>
						<View style={styles.dividerLine} />
					</View>

					{/* Google (placeholder) */}
					<TouchableOpacity style={styles.googleBtn} activeOpacity={0.8}>
						<Text style={styles.googleG}>G</Text>
						<Text style={styles.googleText}>Google</Text>
					</TouchableOpacity>

					{/* Sign Up link */}
					<View style={styles.signupRow}>
						<Text style={styles.signupHint}>Don't have any account? </Text>
						<TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
							<Text style={styles.signupLink}>Sign Up</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#FDF5F0',
	},
	scroll: {
		flex: 1,
		backgroundColor: '#FDF5F0',
	},
	form: {
		paddingHorizontal: 24,
		paddingTop: 28,
		paddingBottom: 40,
	},
	fieldGroup: {
		marginBottom: 20,
	},
	label: {
		fontSize: 14,
		fontWeight: '600',
		color: COLORS.textPrimary,
		marginBottom: 8,
	},
	required: {
		color: COLORS.error,
	},
	input: {
		height: SIZES.inputHeight,
		borderWidth: 1.5,
		borderColor: COLORS.inputBorder,
		borderRadius: SIZES.borderRadius,
		paddingHorizontal: 16,
		fontSize: 15,
		color: COLORS.textPrimary,
		backgroundColor: COLORS.surface,
	},
	inputRow: {
		position: 'relative',
	},
	inputFlex: {
		paddingRight: 50,
	},
	eyeBtn: {
		position: 'absolute',
		right: 14,
		top: 0,
		height: SIZES.inputHeight,
		justifyContent: 'center',
	},
	eyeIcon: {
		fontSize: 18,
	},
	forgotRow: {
		alignItems: 'flex-end',
		marginTop: 8,
	},
	forgotText: {
		color: COLORS.textLink,
		fontSize: 13,
		fontWeight: '500',
	},
	primaryBtn: {
		height: SIZES.buttonHeight,
		backgroundColor: COLORS.primary,
		borderRadius: 30,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 8,
		marginBottom: 24,
	},
	primaryBtnDisabled: {
		opacity: 0.65,
	},
	primaryBtnText: {
		color: '#FFFFFF',
		fontSize: 16,
		fontWeight: '700',
		letterSpacing: 0.3,
	},
	dividerRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 20,
	},
	dividerLine: {
		flex: 1,
		height: 1,
		backgroundColor: COLORS.divider,
	},
	dividerText: {
		marginHorizontal: 12,
		color: COLORS.textSecondary,
		fontSize: 13,
	},
	googleBtn: {
		height: SIZES.buttonHeight,
		borderWidth: 1.5,
		borderColor: COLORS.googleBorder,
		borderRadius: 30,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: COLORS.surface,
		gap: 10,
	},
	googleG: {
		fontSize: 18,
		fontWeight: '700',
		color: '#4285F4',
	},
	googleText: {
		fontSize: 15,
		fontWeight: '600',
		color: COLORS.textPrimary,
	},
	signupRow: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 24,
	},
	signupHint: {
		fontSize: 14,
		color: COLORS.textSecondary,
	},
	signupLink: {
		fontSize: 14,
		fontWeight: '700',
		color: COLORS.textLink,
	},
});
