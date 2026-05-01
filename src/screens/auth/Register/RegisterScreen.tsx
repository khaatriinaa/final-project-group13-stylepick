// src/screens/auth/Register/RegisterScreen.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Platform,
  Pressable,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { RegisterScreenProps } from '../../../props/props';
import { register } from '../../../services/authService';
import { useAuth } from '../../../context/AuthContext';
import { styles } from './RegisterScreen.styles';
import { UserRole } from '../../../types';

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

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Refs for smooth keyboard navigation
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const handleRegister = async (values: Values) => {
    setLoading(true);
    try {
      const user = await register({
        name: values.name,
        email: values.email,
        password: values.password,
        role: 'buyer' as UserRole,
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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* ── Top Bar (Fixed) ────────────────────────────────────────── */}
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

        <View style={styles.topBarBrand}>
          <Text style={styles.topBarName}>StylePick</Text>
        </View>
        <View style={styles.topBarSpacer} />
      </View>

      {/* ── Scrollable Body ────────────────────────────────────────── */}
      <KeyboardAwareScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        enableOnAndroid={true}
        enableAutomaticScroll={Platform.OS === 'ios'}
        extraScrollHeight={Platform.OS === 'ios' ? 40 : 0}
        extraHeight={Platform.OS === 'ios' ? 100 : 0}
        keyboardOpeningTime={0}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
        scrollEventThrottle={16}
      >
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
              <View style={styles.fieldsWrapper}>
                {/* Full Name */}
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
                      placeholderTextColor="#B8B4C0"
                      autoCapitalize="words"
                      autoCorrect={false}
                      returnKeyType="next"
                      onChangeText={handleChange('name')}
                      onBlur={() => { handleBlur('name'); setFocusedField(null); }}
                      onFocus={() => setFocusedField('name')}
                      onSubmitEditing={() => emailRef.current?.focus()}
                      blurOnSubmit={false}
                      value={values.name}
                    />
                  </View>
                  {touched.name && errors.name && (
                    <Text style={styles.errorText}>{errors.name}</Text>
                  )}
                </View>

                {/* Email Address */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Email Address</Text>
                  <View style={[
                    styles.inputWrap,
                    focusedField === 'email' && styles.inputWrapFocus,
                    touched.email && errors.email ? styles.inputWrapError : undefined,
                  ]}>
                    <TextInput
                      ref={emailRef}
                      style={styles.input}
                      placeholder="your@email.com"
                      placeholderTextColor="#B8B4C0"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      returnKeyType="next"
                      onChangeText={handleChange('email')}
                      onBlur={() => { handleBlur('email'); setFocusedField(null); }}
                      onFocus={() => setFocusedField('email')}
                      onSubmitEditing={() => passwordRef.current?.focus()}
                      blurOnSubmit={false}
                      value={values.email}
                    />
                  </View>
                  {touched.email && errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}
                </View>

                <View style={styles.sectionRule} />

                {/* Password */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Password</Text>
                  <View style={[
                    styles.inputWrap,
                    focusedField === 'password' && styles.inputWrapFocus,
                    touched.password && errors.password ? styles.inputWrapError : undefined,
                  ]}>
                    <TextInput
                      ref={passwordRef}
                      style={styles.input}
                      placeholder="Create a password"
                      placeholderTextColor="#B8B4C0"
                      secureTextEntry={!showPass}
                      returnKeyType="next"
                      onChangeText={handleChange('password')}
                      onBlur={() => { handleBlur('password'); setFocusedField(null); }}
                      onFocus={() => setFocusedField('password')}
                      onSubmitEditing={() => confirmRef.current?.focus()}
                      blurOnSubmit={false}
                      value={values.password}
                    />
                    <Pressable onPress={() => setShowPass(v => !v)} hitSlop={10}>
                      <Text style={styles.showHideText}>{showPass ? 'Hide' : 'Show'}</Text>
                    </Pressable>
                  </View>
                  {touched.password && errors.password
                    ? <Text style={styles.errorText}>{errors.password}</Text>
                    : <Text style={styles.hintText}>Minimum 6 characters</Text>
                  }
                </View>

                {/* Confirm Password */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Confirm Password</Text>
                  <View style={[
                    styles.inputWrap,
                    focusedField === 'confirmPassword' && styles.inputWrapFocus,
                    touched.confirmPassword && errors.confirmPassword ? styles.inputWrapError : undefined,
                  ]}>
                    <TextInput
                      ref={confirmRef}
                      style={styles.input}
                      placeholder="Re-enter your password"
                      placeholderTextColor="#B8B4C0"
                      secureTextEntry={!showConfirmPass}
                      returnKeyType="done"
                      onChangeText={handleChange('confirmPassword')}
                      onBlur={() => { handleBlur('confirmPassword'); setFocusedField(null); }}
                      onFocus={() => setFocusedField('confirmPassword')}
                      onSubmitEditing={() => handleSubmit()}
                      value={values.confirmPassword}
                    />
                    <Pressable onPress={() => setShowConfirmPass(v => !v)} hitSlop={10}>
                      <Text style={styles.showHideText}>{showConfirmPass ? 'Hide' : 'Show'}</Text>
                    </Pressable>
                  </View>
                  {touched.confirmPassword && errors.confirmPassword && (
                    <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                  )}
                </View>
              </View>

              <View style={styles.bottomSection}>
                <View style={styles.termsRow}>
                  <Text style={styles.termsText}>
                    By creating an account you agree to our{' '}
                    <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                    <Text style={styles.termsLink}>Privacy Policy</Text>
                  </Text>
                </View>

                <Pressable
                  style={({ pressed }) => [
                    styles.submitBtn,
                    pressed && styles.submitBtnPressed,
                  ]}
                  onPress={() => handleSubmit()}
                  disabled={loading}
                >
                  {loading
                    ? <ActivityIndicator color="#FFFFFF" size="small" />
                    : <Text style={styles.submitBtnText}>Create Account</Text>
                  }
                </Pressable>

                <View style={styles.dividerWrap}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>

                <View style={styles.footerRow}>
                  <Text style={styles.footerText}>Already have an account?</Text>
                  <Pressable onPress={() => navigation.goBack()}>
                    <Text style={styles.footerLink}>Sign in</Text>
                  </Pressable>
                </View>
              </View>
            </>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </View>
  );
}