// src/screens/auth/Register/RegisterScreen.tsx
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
import { Formik } from 'formik';
import * as Yup from 'yup';
import { RegisterScreenProps } from '../../../props/props';
import { register } from '../../../services/authService';
import { useAuth } from '../../../context/AuthContext';
import { styles } from './RegisterScreen.styles';
import { UserRole } from '../../../types';

// ─── Validation ───────────────────────────────────────────────────────────────
const Schema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Full name is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your password'),
});

interface Values {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const { setUser } = useAuth();
  const [loading, setLoading]                 = useState(false);
  const [showPass, setShowPass]               = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [focusedField, setFocusedField]       = useState<string | null>(null);

  const handleRegister = async (values: Values) => {
    setLoading(true);
    try {
      const user = await register({
        name:     values.name,
        email:    values.email,
        password: values.password,
        role:     'buyer' as UserRole,
      });
      setUser(user);
    } catch (err: any) {
      Alert.alert(
        'Registration Failed',
        err.message ?? 'Something went wrong. Please try again.',
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
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          bounces={false}
          showsVerticalScrollIndicator={false}
        >

          {/* ── Top Bar ─────────────────────────────────────────────── */}
          <View style={styles.topBar}>
            <Pressable
              style={({ pressed }) => [
                styles.backCircle,
                pressed && styles.backCirclePressed,
              ]}
              onPress={() => navigation.goBack()}
              hitSlop={10}
            >
              <Text style={styles.backArrow}>‹</Text>
            </Pressable>

            {/* Centred brand name */}
            <View style={styles.topBarBrand}>
              <Text style={styles.topBarName}>StylePick</Text>
            </View>

            {/* Balance spacer — same width as back circle */}
            <View style={styles.topBarSpacer} />
          </View>

          {/* ── Cream Body ──────────────────────────────────────────── */}
          <View style={styles.body}>

            {/* Form header */}
            <View style={styles.formHeader}>
              <Text style={styles.formEyebrow}>New member</Text>
              <Text style={styles.formTitle}>Create your account</Text>
              <Text style={styles.formSubtitle}>
                Join the StylePick community today
              </Text>
            </View>

            <Formik<Values>
              initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
              validationSchema={Schema}
              onSubmit={handleRegister}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <>
                  {/* ── Full Name ───────────────────────────────────── */}
                  <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Full Name</Text>
                    <View style={[
                      styles.inputWrap,
                      focusedField === 'name' && styles.inputWrapFocus,
                      touched.name && errors.name ? styles.inputWrapError : undefined,
                    ]}>
                      <TextInput
                        style={styles.input}
                        placeholder="Your full name"
                        placeholderTextColor="#c4bbb0"
                        autoCapitalize="words"
                        autoCorrect={false}
                        onChangeText={handleChange('name')}
                        onBlur={() => { handleBlur('name'); setFocusedField(null); }}
                        onFocus={() => setFocusedField('name')}
                        value={values.name}
                      />
                    </View>
                    {touched.name && errors.name && (
                      <Text style={styles.errorText}>{errors.name}</Text>
                    )}
                  </View>

                  {/* ── Email ───────────────────────────────────────── */}
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

                  {/* ── Section rule before password fields ─────────── */}
                  <View style={styles.sectionRule} />

                  {/* ── Password ────────────────────────────────────── */}
                  <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Password</Text>
                    <View style={[
                      styles.inputWrap,
                      focusedField === 'password' && styles.inputWrapFocus,
                      touched.password && errors.password ? styles.inputWrapError : undefined,
                    ]}>
                      <TextInput
                        style={styles.input}
                        placeholder="Create a password"
                        placeholderTextColor="#c4bbb0"
                        secureTextEntry={!showPass}
                        onChangeText={handleChange('password')}
                        onBlur={() => { handleBlur('password'); setFocusedField(null); }}
                        onFocus={() => setFocusedField('password')}
                        value={values.password}
                      />
                      <Pressable onPress={() => setShowPass(v => !v)} hitSlop={10}>
                        <Text style={styles.showHideText}>
                          {showPass ? 'Hide' : 'Show'}
                        </Text>
                      </Pressable>
                    </View>
                    {touched.password && errors.password
                      ? <Text style={styles.errorText}>{errors.password}</Text>
                      : <Text style={styles.hintText}>Minimum 6 characters</Text>
                    }
                  </View>

                  {/* ── Confirm Password ────────────────────────────── */}
                  <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Confirm Password</Text>
                    <View style={[
                      styles.inputWrap,
                      focusedField === 'confirmPassword' && styles.inputWrapFocus,
                      touched.confirmPassword && errors.confirmPassword
                        ? styles.inputWrapError
                        : undefined,
                    ]}>
                      <TextInput
                        style={styles.input}
                        placeholder="Re-enter your password"
                        placeholderTextColor="#c4bbb0"
                        secureTextEntry={!showConfirmPass}
                        onChangeText={handleChange('confirmPassword')}
                        onBlur={() => { handleBlur('confirmPassword'); setFocusedField(null); }}
                        onFocus={() => setFocusedField('confirmPassword')}
                        value={values.confirmPassword}
                      />
                      <Pressable onPress={() => setShowConfirmPass(v => !v)} hitSlop={10}>
                        <Text style={styles.showHideText}>
                          {showConfirmPass ? 'Hide' : 'Show'}
                        </Text>
                      </Pressable>
                    </View>
                    {touched.confirmPassword && errors.confirmPassword && (
                      <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                    )}
                  </View>

                  {/* ── Terms notice ────────────────────────────────── */}
                  <View style={styles.termsRow}>
                    <Text style={styles.termsText}>
                      By creating an account you agree to our{' '}
                      <Text style={styles.termsLink}>Terms of Service</Text>
                      {' '}and{' '}
                      <Text style={styles.termsLink}>Privacy Policy</Text>
                    </Text>
                  </View>

                  {/* ── Submit ──────────────────────────────────────── */}
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
                      : <Text style={styles.submitBtnText}>Create Account</Text>
                    }
                  </Pressable>
                </>
              )}
            </Formik>

            {/* ── Divider ───────────────────────────────────────────── */}
            <View style={styles.dividerWrap}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* ── Footer ────────────────────────────────────────────── */}
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <Pressable onPress={() => navigation.goBack()}>
                <Text style={styles.footerLink}>Sign in</Text>
              </Pressable>
            </View>

          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}