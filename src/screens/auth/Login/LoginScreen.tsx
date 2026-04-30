// src/screens/auth/Login/LoginScreen.tsx
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
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { LoginScreenProps } from '../../../props/props';
import { login } from '../../../services/authService';
import { useAuth } from '../../../context/AuthContext';
import { styles } from './LoginScreen.styles';

const Schema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const passwordRef = useRef<TextInput>(null);

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const user = await login(values);
      setUser(user);
    } catch (err: any) {
      Alert.alert(
        'Sign In Failed',
        err.message ?? "We couldn't verify your credentials. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <SafeAreaView style={styles.heroSafe}>
        <View style={styles.hero}>
          <View style={styles.heroGlow} />
          <View style={styles.heroAccentDot} />
          <View style={styles.brand}>
            <View style={styles.brandMark}>
              <Text style={styles.brandMarkText}>S</Text>
            </View>
            <Text style={styles.brandName}>StylePick</Text>
            <View style={styles.brandRule} />
            <Text style={styles.brandSub}>Curated fashion for you</Text>
          </View>
        </View>
      </SafeAreaView>

      <KeyboardAwareScrollView
        style={styles.bodyScroll}
        contentContainerStyle={styles.bodyContent}
        // Critical props to stop the "bounce" and "glitch"
        enableOnAndroid={true}
        enableAutomaticScroll={Platform.OS === 'ios'}
        extraScrollHeight={Platform.OS === 'ios' ? 50 : 0} 
        extraHeight={Platform.OS === 'ios' ? 100 : 0}
        keyboardOpeningTime={0}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
        scrollEventThrottle={16}
      >
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
                    placeholderTextColor="#B8B4C0"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    onChangeText={handleChange('email')}
                    onBlur={() => { handleBlur('email'); setFocusedField(null); }}
                    onFocus={() => setFocusedField('email')}
                    onSubmitEditing={() => passwordRef.current?.focus()}
                    value={values.email}
                  />
                </View>
                {touched.email && errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>

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
                    placeholder="••••••••"
                    placeholderTextColor="#B8B4C0"
                    secureTextEntry={!showPass}
                    returnKeyType="done"
                    onChangeText={handleChange('password')}
                    onBlur={() => { handleBlur('password'); setFocusedField(null); }}
                    onFocus={() => setFocusedField('password')}
                    onSubmitEditing={() => handleSubmit()}
                    value={values.password}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPass(v => !v)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.showHideText}>
                      {showPass ? 'Hide' : 'Show'}
                    </Text>
                  </TouchableOpacity>
                </View>
                {touched.password && errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
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
                  : <Text style={styles.submitBtnText}>Sign In</Text>
                }
              </Pressable>
            </>
          )}
        </Formik>

        <View style={styles.dividerWrap}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>No account?</Text>
          <Pressable onPress={() => navigation.navigate('Register')}>
            <Text style={styles.footerLink}>Create one</Text>
          </Pressable>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}