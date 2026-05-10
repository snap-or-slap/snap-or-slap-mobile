import React, { useEffect, useState } from 'react';
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
import usersService from '../services/users.service';

function CheckItem({ checked, label }) {
	return (
		<View style={styles.checkRow}>
			<View style={[styles.checkbox, checked && styles.checkboxChecked]}>
				{checked && <Text style={styles.checkMark}>✓</Text>}
			</View>
			<Text style={styles.checkLabel}>{label}</Text>
		</View>
	);
}

export default function SignUpScreen({ navigation }) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [username, setUsername] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const [touched, setTouched] = useState({});
	const [loading, setLoading] = useState(false);
	const [usernameUnique, setUsernameUnique] = useState(null);
	const [checkingUsername, setCheckingUsername] = useState(false);

	const passwordMismatch =
		touched.confirmPassword && confirmPassword.length > 0 && confirmPassword !== password;

	const usernameRules = {
		length: username.length >= 4 && username.length <= 20,
		lowercase: /^[a-z0-9_]*$/.test(username) && username.length > 0,
		unique: usernameUnique === true,
	};

	useEffect(() => {
		const normalizedUsername = username.trim().toLowerCase();

		if (!normalizedUsername) {
			setUsernameUnique(null);
			setCheckingUsername(false);
			return undefined;
		}

		if (
			normalizedUsername.length < 4
			|| normalizedUsername.length > 20
			|| !/^[a-z0-9_]+$/.test(normalizedUsername)
		) {
			setUsernameUnique(null);
			setCheckingUsername(false);
			return undefined;
		}

		let active = true;
		setCheckingUsername(true);

		const timeout = setTimeout(async () => {
			try {
				const result = await usersService.checkUsername(normalizedUsername);
				if (active) {
					setUsernameUnique(result.available);
				}
			} catch {
				if (active) {
					setUsernameUnique(null);
				}
			} finally {
				if (active) {
					setCheckingUsername(false);
				}
			}
		}, 350);

		return () => {
			active = false;
			clearTimeout(timeout);
		};
	}, [username]);

	const handleRegister = async () => {
		if (!email || !password || !confirmPassword || !username) {
			Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
			return;
		}
		if (password !== confirmPassword) {
			Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
			return;
		}
		if (!usernameRules.length || !usernameRules.lowercase) {
			Alert.alert('Lỗi', 'Username không hợp lệ');
			return;
		}
		if (checkingUsername) {
			Alert.alert('Chờ một chút', 'Đang kiểm tra username');
			return;
		}
		if (usernameUnique === false) {
			Alert.alert('Lỗi', 'Username này đã được sử dụng');
			return;
		}
		try {
			setLoading(true);
			await authService.register({
				email: email.trim().toLowerCase(),
				password,
				username: username.trim().toLowerCase(),
			});
			navigation.replace('Home');
		} catch (err) {
			Alert.alert('Đăng ký thất bại', err.message || 'Có lỗi xảy ra');
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
				<WaveHeader title="Register" onBack={() => navigation.goBack()} />

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
						<Text style={styles.hint}>Must be at least 6 characters</Text>
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
					</View>

					{/* Confirm Password */}
					<View style={styles.fieldGroup}>
						<Text style={[styles.label, passwordMismatch && styles.labelError]}>
							Confirm Password <Text style={styles.required}>*</Text>
						</Text>
						<View style={styles.inputRow}>
							<TextInput
								style={[styles.input, styles.inputFlex, passwordMismatch && styles.inputError]}
								placeholder="Placeholder Text"
								placeholderTextColor={COLORS.textMuted}
								value={confirmPassword}
								onChangeText={setConfirmPassword}
								onBlur={() => setTouched((t) => ({ ...t, confirmPassword: true }))}
								secureTextEntry={!showConfirm}
								autoCapitalize="none"
							/>
							<TouchableOpacity
								style={styles.eyeBtn}
								onPress={() => setShowConfirm(!showConfirm)}
							>
								<Text style={styles.eyeIcon}>{showConfirm ? '🙈' : '👁'}</Text>
							</TouchableOpacity>
						</View>
						{passwordMismatch && (
							<View style={styles.errorRow}>
								<Text style={styles.errorIcon}>⚠</Text>
								<Text style={styles.errorText}>Password does not match</Text>
							</View>
						)}
					</View>

					{/* Username */}
					<View style={styles.fieldGroup}>
						<Text style={styles.label}>
							User Name <Text style={styles.required}>*</Text>
						</Text>
						<TextInput
							style={styles.input}
							placeholder="huangfu_1204"
							placeholderTextColor={COLORS.textMuted}
							value={username}
							onChangeText={(value) => {
								setUsername(value.trim().toLowerCase());
								setUsernameUnique(null);
							}}
							autoCapitalize="none"
							autoCorrect={false}
						/>
						<Text style={styles.hint}>Friends will use this to find you</Text>

						{/* Validation checklist */}
						<View style={styles.checkList}>
							<CheckItem checked={usernameRules.length} label="Must be 4–20 characters" />
							<CheckItem
								checked={usernameRules.lowercase}
								label="Only lowercase letters, numbers, and underscores"
							/>
							<CheckItem
								checked={usernameRules.unique}
								label={
									checkingUsername
										? 'Checking availability...'
										: usernameUnique === false
											? 'Username is already taken'
											: 'Is unique'
								}
							/>
						</View>
					</View>

					{/* Terms */}
					<Text style={styles.termsText}>
						By continuing, you agree to our{' '}
						<Text style={styles.termsLink}>Terms</Text> and{' '}
						<Text style={styles.termsLink}>Privacy Policy</Text>
					</Text>

					{/* Create Account Button */}
					<TouchableOpacity
						style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
						onPress={handleRegister}
						activeOpacity={0.85}
						disabled={loading}
					>
						{loading
							? <ActivityIndicator color="#fff" />
							: <Text style={styles.primaryBtnText}>Create account</Text>
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

					{/* Sign In link */}
					<View style={styles.signinRow}>
						<Text style={styles.signinHint}>Already have an account? </Text>
						<TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
							<Text style={styles.signinLink}>Log in</Text>
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
	labelError: {
		color: COLORS.error,
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
	inputFlex: {
		paddingRight: 50,
	},
	inputError: {
		borderColor: COLORS.inputBorderError,
	},
	inputRow: {
		position: 'relative',
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
	hint: {
		fontSize: 12,
		color: COLORS.textSecondary,
		marginTop: 6,
	},
	errorRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 6,
		gap: 4,
	},
	errorIcon: {
		fontSize: 12,
		color: COLORS.error,
	},
	errorText: {
		fontSize: 12,
		color: COLORS.error,
		fontWeight: '500',
	},
	checkList: {
		marginTop: 12,
		gap: 8,
	},
	checkRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
	},
	checkbox: {
		width: 18,
		height: 18,
		borderWidth: 1.5,
		borderColor: COLORS.inputBorder,
		borderRadius: 3,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: COLORS.surface,
	},
	checkboxChecked: {
		backgroundColor: COLORS.checkboxChecked,
		borderColor: COLORS.checkboxChecked,
	},
	checkMark: {
		color: '#FFFFFF',
		fontSize: 11,
		fontWeight: '700',
	},
	checkLabel: {
		fontSize: 13,
		color: COLORS.textSecondary,
		flex: 1,
	},
	termsText: {
		fontSize: 13,
		color: COLORS.textSecondary,
		textAlign: 'center',
		marginBottom: 20,
		lineHeight: 20,
	},
	termsLink: {
		color: COLORS.textLink,
		fontWeight: '600',
		textDecorationLine: 'underline',
	},
	primaryBtn: {
		height: SIZES.buttonHeight,
		backgroundColor: COLORS.primary,
		borderRadius: 30,
		alignItems: 'center',
		justifyContent: 'center',
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
	signinRow: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 24,
	},
	signinHint: {
		fontSize: 14,
		color: COLORS.textSecondary,
	},
	signinLink: {
		fontSize: 14,
		fontWeight: '700',
		color: COLORS.textLink,
	},
});
