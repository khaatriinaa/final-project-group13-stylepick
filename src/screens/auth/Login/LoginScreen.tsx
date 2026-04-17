// src/screens/auth/Login/LoginScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback,
  Keyboard, Platform, Pressable, ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { LoginScreenProps } from '../../../props/props';
import { login } from '../../../services/authService';
import { useAuth } from '../../../context/AuthContext';
import { styles } from './LoginScreen.styles';

const Schema = Yup.object().shape({
  email:    Yup.string().email('Please enter a valid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const user = await login(values);
      setUser(user);
    } catch (err: any) {
      Alert.alert('Login Failed', err.message ?? 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.inner}>
            <View style={styles.logoRow}>
              <Text style={styles.logoText}>ShopGo</Text>
              <Text style={styles.logoSub}>Your fashion destination</Text>
            </View>

            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Welcome back</Text>
              <Text style={styles.formSubtitle}>Sign in to your account</Text>

              <Formik initialValues={{ email: '', password: '' }} validationSchema={Schema} onSubmit={handleLogin}>
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                  <>
                    <View style={styles.fieldGroup}>
                      <Text style={styles.label}>Email Address</Text>
                      <View style={[styles.inputWrap, touched.email && errors.email ? styles.inputWrapError : null]}>
                        <TextInput
                          style={styles.input} placeholder="Enter your email"
                          placeholderTextColor="#9CA3AF" keyboardType="email-address" autoCapitalize="none"
                          onChangeText={handleChange('email')} onBlur={handleBlur('email')} value={values.email}
                        />
                      </View>
                      {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                    </View>

                    <View style={styles.fieldGroup}>
                      <Text style={styles.label}>Password</Text>
                      <View style={[styles.inputWrap, touched.password && errors.password ? styles.inputWrapError : null]}>
                        <TextInput
                          style={styles.input} placeholder="Enter your password"
                          placeholderTextColor="#9CA3AF" secureTextEntry={!showPass}
                          onChangeText={handleChange('password')} onBlur={handleBlur('password')} value={values.password}
                        />
                        <Pressable onPress={() => setShowPass(!showPass)} style={{ padding: 4 }}>
                          <Text style={{ fontSize: 12, color: '#6B7280' }}>{showPass ? 'Hide' : 'Show'}</Text>
                        </Pressable>
                      </View>
                      {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                    </View>

                    <Pressable
                      style={({ pressed }) => [styles.submitBtn, pressed && styles.submitBtnPressed]}
                      onPress={() => handleSubmit()} disabled={loading}
                    >
                      {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitBtnText}>Sign In</Text>}
                    </Pressable>
                  </>
                )}
              </Formik>
            </View>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Don't have an account?</Text>
              <Pressable onPress={() => navigation.navigate('Register')}>
                <Text style={styles.footerLink}> Create Account</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
