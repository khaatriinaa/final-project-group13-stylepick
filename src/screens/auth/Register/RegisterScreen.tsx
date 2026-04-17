// src/screens/auth/Register/RegisterScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback,
  Keyboard, Platform, Pressable, ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { RegisterScreenProps } from '../../../props/props';
import { register } from '../../../services/authService';
import { useAuth } from '../../../context/AuthContext';
import { styles } from './RegisterScreen.styles';
import { UserRole } from '../../../types';

const Schema = Yup.object().shape({
  name:            Yup.string().min(2, 'Name must be at least 2 characters').required('Full name is required'),
  email:           Yup.string().email('Please enter a valid email').required('Email is required'),
  password:        Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords do not match').required('Please confirm your password'),
  role:            Yup.string().oneOf(['buyer', 'seller']).required('Please select an account type'),
});

interface Values { name: string; email: string; password: string; confirmPassword: string; role: UserRole; }

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (values: Values) => {
    setLoading(true);
    try {
      const user = await register({ name: values.name, email: values.email, password: values.password, role: values.role });
      setUser(user);
    } catch (err: any) {
      Alert.alert('Registration Failed', err.message ?? 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.inner}>
            <Pressable style={({ pressed }) => [styles.backBtn, pressed && styles.backBtnPressed]} onPress={() => navigation.goBack()}>
              <Text style={{ fontSize: 18, color: '#374151' }}>‹</Text>
            </Pressable>

            <Text style={styles.logoText}>ShopGo</Text>
            <Text style={styles.title}>Create your account</Text>
            <Text style={styles.subtitle}>Join thousands of fashion shoppers</Text>

            <Formik<Values>
              initialValues={{ name: '', email: '', password: '', confirmPassword: '', role: 'buyer' }}
              validationSchema={Schema} onSubmit={handleRegister}
            >
              {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
                <>
                  {[
                    { field: 'name',  label: 'Full Name',  placeholder: 'Enter your full name',  keyboard: 'default' as const },
                    { field: 'email', label: 'Email Address', placeholder: 'Enter your email', keyboard: 'email-address' as const },
                  ].map(({ field, label, placeholder, keyboard }) => (
                    <View key={field} style={styles.fieldGroup}>
                      <Text style={styles.label}>{label}</Text>
                      <View style={[styles.inputWrap, touched[field as keyof Values] && errors[field as keyof Values] ? styles.inputWrapError : null]}>
                        <TextInput
                          style={styles.input} placeholder={placeholder} placeholderTextColor="#9CA3AF"
                          keyboardType={keyboard} autoCapitalize={field === 'email' ? 'none' : 'words'}
                          onChangeText={handleChange(field)} onBlur={handleBlur(field)} value={values[field as keyof Values] as string}
                        />
                      </View>
                      {touched[field as keyof Values] && errors[field as keyof Values] && (
                        <Text style={styles.errorText}>{errors[field as keyof Values] as string}</Text>
                      )}
                    </View>
                  ))}

                  <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Password</Text>
                    <View style={[styles.inputWrap, touched.password && errors.password ? styles.inputWrapError : null]}>
                      <TextInput style={styles.input} placeholder="Create a password" placeholderTextColor="#9CA3AF"
                        secureTextEntry onChangeText={handleChange('password')} onBlur={handleBlur('password')} value={values.password} />
                    </View>
                    {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                  </View>

                  <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Confirm Password</Text>
                    <View style={[styles.inputWrap, touched.confirmPassword && errors.confirmPassword ? styles.inputWrapError : null]}>
                      <TextInput style={styles.input} placeholder="Re-enter your password" placeholderTextColor="#9CA3AF"
                        secureTextEntry onChangeText={handleChange('confirmPassword')} onBlur={handleBlur('confirmPassword')} value={values.confirmPassword} />
                    </View>
                    {touched.confirmPassword && errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                  </View>

                  <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Account Type</Text>
                    <View style={styles.roleRow}>
                      {(['buyer', 'seller'] as UserRole[]).map((role) => (
                        <Pressable key={role} style={[styles.roleBtn, values.role === role && styles.roleBtnActive]} onPress={() => setFieldValue('role', role)}>
                          <Text style={[styles.roleBtnLabel, values.role === role && styles.roleBtnLabelActive]}>
                            {role === 'buyer' ? 'Buyer' : 'Seller'}
                          </Text>
                          <Text style={styles.roleBtnSub}>{role === 'buyer' ? 'Shop products' : 'Sell products'}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>

                  <Pressable style={({ pressed }) => [styles.submitBtn, pressed && styles.submitBtnPressed]}
                    onPress={() => handleSubmit()} disabled={loading}>
                    {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitBtnText}>Create Account</Text>}
                  </Pressable>
                </>
              )}
            </Formik>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <Pressable onPress={() => navigation.goBack()}><Text style={styles.footerLink}> Sign In</Text></Pressable>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
