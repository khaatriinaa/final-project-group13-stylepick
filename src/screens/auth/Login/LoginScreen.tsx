// src/screens/auth/Login/LoginScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Svg, { Polygon, Circle, Line } from 'react-native-svg';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { LoginScreenProps } from '../../../props/props';
import { login } from '../../../services/authService';
import { useAuth } from '../../../context/AuthContext';
import { styles } from './LoginScreen.styles';

// ─── Decorative Diamond ───────────────────────────────────────────────────────
function HeroDiamond() {
  return (
    <Svg width={80} height={56} viewBox="0 0 80 56" fill="none">
      {/* Outer diamond */}
      <Polygon
        points="40,3 77,28 40,53 3,28"
        fill="none"
        stroke="#c9a96e"
        strokeWidth={0.6}
        opacity={0.35}
      />
      {/* Middle diamond */}
      <Polygon
        points="40,11 65,28 40,45 15,28"
        fill="none"
        stroke="#c9a96e"
        strokeWidth={0.5}
        opacity={0.2}
      />
      {/* Inner diamond */}
      <Polygon
        points="40,18 56,28 40,38 24,28"
        fill="none"
        stroke="#c9a96e"
        strokeWidth={0.4}
        opacity={0.15}
      />
      {/* Corner tick marks */}
      <Line x1="40" y1="3" x2="40" y2="0" stroke="#c9a96e" strokeWidth={0.6} opacity={0.5} />
      <Line x1="40" y1="53" x2="40" y2="56" stroke="#c9a96e" strokeWidth={0.6} opacity={0.5} />
      <Line x1="3" y1="28" x2="0" y2="28" stroke="#c9a96e" strokeWidth={0.6} opacity={0.5} />
      <Line x1="77" y1="28" x2="80" y2="28" stroke="#c9a96e" strokeWidth={0.6} opacity={0.5} />
      {/* Centre gem */}
      <Circle cx={40} cy={28} r={2.5} fill="#c9a96e" opacity={0.75} />
      <Circle cx={40} cy={28} r={4.5} fill="none" stroke="#c9a96e" strokeWidth={0.4} opacity={0.3} />
    </Svg>
  );
}

// ─── Validation ───────────────────────────────────────────────────────────────
const Schema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

// ─── Component ────────────────────────────────────────────────────────────────
export default function LoginScreen({ navigation }: LoginScreenProps) {
  const { setUser } = useAuth();
  const [loading, setLoading]           = useState(false);
  const [showPass, setShowPass]         = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const user = await login(values);
      setUser(user);
    } catch (err: any) {
      Alert.alert(
        'Sign In Failed',
        err.message ?? 'We couldn\'t verify your credentials. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inner}>

            {/* ── Hero ──────────────────────────────────────────────── */}
            <View style={styles.hero}>
              {/* Soft ambient glow behind diamond */}
              <View style={styles.heroGlow} />

              <View style={styles.heroDiamond}>
                <HeroDiamond />
              </View>

              <View style={styles.brand}>
                <Text style={styles.brandName}>StylePick</Text>
                <View style={styles.brandRule} />
                <Text style={styles.brandSub}>Curated fashion for you</Text>
              </View>
            </View>

            {/* ── Body ──────────────────────────────────────────────── */}
            <View style={styles.body}>

              {/* Form header */}
              <View style={styles.formHeader}>
                <Text style={styles.formEyebrow}>Member access</Text>
                <Text style={styles.formTitle}>Welcome back!</Text>
                <Text style={styles.formSubtitle}>
                  Sign in to continue your style journey
                </Text>
              </View>

              <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={Schema}
                onSubmit={handleLogin}
              >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                  <>
                    {/* ── Email ─────────────────────────────────────── */}
                    <View style={styles.fieldGroup}>
                      <Text style={styles.label}>Email Address</Text>
                      <View style={[
                        styles.inputWrap,
                        focusedField === 'email' && styles.inputWrapFocus,
                        touched.email && errors.email ? styles.inputWrapError : undefined,
                      ]}>
                        <TextInput
                          style={styles.input}
                          placeholder="your@email.com"
                          placeholderTextColor="#c4bbb0"
                          keyboardType="email-address"
                          autoCapitalize="none"
                          autoCorrect={false}
                          onChangeText={handleChange('email')}
                          onBlur={() => { handleBlur('email'); setFocusedField(null); }}
                          onFocus={() => setFocusedField('email')}
                          value={values.email}
                        />
                      </View>
                      {touched.email && errors.email && (
                        <Text style={styles.errorText}>{errors.email}</Text>
                      )}
                    </View>

                    {/* ── Password ──────────────────────────────────── */}
                    <View style={styles.fieldGroup}>
                      <Text style={styles.label}>Password</Text>
                      <View style={[
                        styles.inputWrap,
                        focusedField === 'password' && styles.inputWrapFocus,
                        touched.password && errors.password ? styles.inputWrapError : undefined,
                      ]}>
                        <TextInput
                          style={styles.input}
                          placeholder="••••••••"
                          placeholderTextColor="#c4bbb0"
                          secureTextEntry={!showPass}
                          onChangeText={handleChange('password')}
                          onBlur={() => { handleBlur('password'); setFocusedField(null); }}
                          onFocus={() => setFocusedField('password')}
                          value={values.password}
                        />
                        <Pressable
                          onPress={() => setShowPass(v => !v)}
                          hitSlop={10}
                        >
                          <Text style={styles.showHideText}>
                            {showPass ? 'Hide' : 'Show'}
                          </Text>
                        </Pressable>
                      </View>
                      {touched.password && errors.password && (
                        <Text style={styles.errorText}>{errors.password}</Text>
                      )}
                    </View>

                    {/* ── Submit ────────────────────────────────────── */}
                    <Pressable
                      style={({ pressed }) => [
                        styles.submitBtn,
                        pressed && styles.submitBtnPressed,
                      ]}
                      onPress={() => handleSubmit()}
                      disabled={loading}
                    >
                      {loading
                        ? <ActivityIndicator color="#ede5d4" size="small" />
                        : <Text style={styles.submitBtnText}>Sign In</Text>
                      }
                    </Pressable>
                  </>
                )}
              </Formik>

              {/* ── Divider ───────────────────────────────────────── */}
              <View style={styles.dividerWrap}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* ── Footer ────────────────────────────────────────── */}
              <View style={styles.footerRow}>
                <Text style={styles.footerText}>No account?</Text>
                <Pressable onPress={() => navigation.navigate('Register')}>
                  <Text style={styles.footerLink}>Create one</Text>
                </Pressable>
              </View>

            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}